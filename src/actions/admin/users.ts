"use server";
import { handleUploadFile } from "@/lib/bunny/upload-file";
import supabaseAdmin from "@/lib/supabase/admin";
import { UserFormSchema } from "@/schemas/admin/user.schema";
import { EnglishLevel, FormActionResponse, Role } from "@/types/globals";
import "server-only";
import { safeParse } from "valibot";

export const deleteUserById = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const supabase = supabaseAdmin();
  const userId = formData.get("userId") as string;
  if (!userId) return { err: "validationError" };
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { err: "deleteFailed" };
  return { msg: "deleteSuccess" };
};

export const deleteUsersById = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const supabase = supabaseAdmin();
  const userIds = formData.getAll("userId") as string[];
  if (!userIds?.length) return { err: "validationError" };
  try {
    const results = await Promise.allSettled(
      userIds.map(async (id) => {
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error) throw error;
        return id;
      })
    );
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      return {
        err: "partialDeleteFailed",
      };
    }
    return {
      msg: "deleteSuccess",
    };
  } catch {
    return { err: "deleteFailed" };
  }
};

export const addUserAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as Role;
  const level = formData.get("level") as EnglishLevel;
  const avatarFile = formData.get("avatarFile") as File;

  const validationResult = safeParse(UserFormSchema(), {
    email,
    password,
    fullName,
    role,
    level,
    avatarFile,
  });

  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }

  const supabase = supabaseAdmin();

  let avatarUrl: boolean | string = "";

  if (avatarFile) {
    avatarUrl = await handleUploadFile(avatarFile, "avatars");
    if (!avatarUrl) return { err: "users.addFailed" };
  }
  try {
    const { data: userData, error: createUserError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          fullName,
          ...(!!avatarUrl && { avatarUrl }),
        },
      });
    if (createUserError || !userData.user) {
      return {
        err: "users.addFailed",
      };
    }
    const userId = userData.user.id;
    if (role === "creator" || role === "admin") {
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
      });
      if (roleError) {
        return {
          err: "users.addFailed",
        };
      }
    }
    if (role === "user") {
      const { data: levelData, error: levelError } = await supabase
        .from("level_requirements")
        .select("min_points")
        .eq("level", level)
        .single();

      if (levelError || !levelData) {
        return {
          err: "users.addFailed",
        };
      }

      const pointsToAdd = levelData.min_points;

      const { error: pointsHistoryError } = await supabase
        .from("user_points_history")
        .insert({
          user_id: userId,
          points_earned: pointsToAdd,
          source_type: "initial",
        });

      if (pointsHistoryError) {
        return {
          err: "users.addFailed",
        };
      }
    }

    return {
      msg: "users.addSuccess",
    };
  } catch {
    return {
      err: "users.addFailed",
    };
  }
};

export const updateUserAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const currentRole = formData.get("currentRole") as Role;
  const role = formData.get("role") as Role;
  const level = formData.get("level") as EnglishLevel;
  const avatarFile = formData.get("avatarFile") as File | string;

  const validationResult = safeParse(UserFormSchema(), {
    email: email || "email@gmail.com",
    password: password || "",
    fullName: fullName || "fullName",
    role: role || Role.USER,
    level: level || EnglishLevel.A1,
    avatarFile: avatarFile || "",
  });

  if (!validationResult.success || !userId) {
    return {
      err: "validationError",
    };
  }

  const supabase = supabaseAdmin();

  try {
    let avatarUrl: false | string = "";
    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      avatarUrl = await handleUploadFile(avatarFile, "avatars");
      if (!avatarUrl) return { err: "users.updateFailed" };
    }

    if (email || password) {
      const { error: updateUserError } =
        await supabase.auth.admin.updateUserById(userId, {
          ...(email && { email }),
          ...(password && { password }),
        });
      if (updateUserError) {
        return {
          err: email ? "users.duplicatedEmail" : "users.updateFailed",
        };
      }
    }

    if (fullName || avatarUrl || avatarFile === "deleted") {
      const { error: updateRoleError } = await supabase
        .from("profiles")
        .update({
          ...(fullName && { full_name: fullName }),
          ...((avatarUrl || avatarFile) && { avatar_url: avatarUrl || null }),
        })
        .eq("user_id", userId);
      if (updateRoleError) {
        return {
          err: "users.updateFailed",
        };
      }
    }

    if (role) {
      if (currentRole !== Role.USER && role !== Role.USER) {
        const { error: updateRoleError } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        if (updateRoleError) {
          return {
            err: "users.updateFailed",
          };
        }
      } else if (
        currentRole === Role.USER &&
        (role === Role.ADMIN || role === Role.CREATOR)
      ) {
        const { error: deleteProgressError } = await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", userId);
        if (deleteProgressError) {
          return {
            err: "users.updateFailed",
          };
        }
        const { error: deletePointsError } = await supabase
          .from("user_points_history")
          .delete()
          .eq("user_id", userId);
        if (deletePointsError) {
          return {
            err: "users.updateFailed",
          };
        }
        const { error: addRoleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            role,
          });
        if (addRoleError) {
          return {
            err: "users.updateFailed",
          };
        }
      } else if (
        (currentRole === Role.ADMIN || currentRole === Role.CREATOR) &&
        role === Role.USER
      ) {
        const { error: deleteRoleError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId);
        if (deleteRoleError) {
          return {
            err: "users.updateFailed",
          };
        }
        if (level !== "A1") {
          const { data: levelData, error: levelError } = await supabase
            .from("level_requirements")
            .select("min_points")
            .eq("level", level)
            .single();
          if (levelError || !levelData) {
            return {
              err: "users.updateFailed",
            };
          }
          const pointsToAdd = levelData.min_points;
          const { error: pointsHistoryError } = await supabase
            .from("user_points_history")
            .insert({
              user_id: userId,
              points_earned: pointsToAdd,
              source_type: "initial",
            });
          if (pointsHistoryError) {
            return {
              err: "users.updateFailed",
            };
          }
        }
      }
    }

    if (role === Role.USER && currentRole === Role.USER && level) {
      const { error: deletePointsError } = await supabase
        .from("user_points_history")
        .delete()
        .eq("user_id", userId);
      if (deletePointsError) {
        return {
          err: "users.updateFailed",
        };
      }
      const { error: updateProgressError } = await supabase
        .from("user_progress")
        .update({
          total_points: 0,
          tests_completed: 0,
          quizzes_completed: 0,
          streak_days: 0,
        })
        .eq("user_id", userId);
      if (updateProgressError) {
        return {
          err: "users.updateFailed",
        };
      }
      const { data: levelData, error: levelError } = await supabase
        .from("level_requirements")
        .select("min_points")
        .eq("level", level)
        .single();
      if (levelError || !levelData) {
        return {
          err: "users.updateFailed",
        };
      }
      const pointsToAdd = levelData.min_points;
      const { error: pointsHistoryError } = await supabase
        .from("user_points_history")
        .insert({
          user_id: userId,
          points_earned: pointsToAdd,
          source_type: "initial",
        });
      if (pointsHistoryError) {
        return {
          err: "users.updateFailed",
        };
      }
    }

    return {
      msg: "users.updateSuccess",
    };
  } catch {
    return {
      err: "users.updateFailed",
    };
  }
};
