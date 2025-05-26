"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Edit, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/context/user";

export type Comment = {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string | null;
  profiles?: {
    user_id: string;
    full_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  optimistic?: boolean;
};

interface CommentSectionProps {
  blogId: string;
  className?: string;
}

export function CommentSection({ blogId, className }: CommentSectionProps) {
  const { userData } = useUser();
  const supabase = supabaseClient();

  // Form states
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Data and UI states
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch comments from the database
  // const fetchComments = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from("blog_comments")
  //       .select(
  //         `
  //         id,
  //         blog_id,
  //         user_id,
  //         content,
  //         parent_id,
  //         created_at,
  //         updated_at,
  //         profiles:user_id (
  //           user_id,
  //           full_name,
  //           avatar_url
  //         )
  //       `
  //       )
  //       .eq("blog_id", blogId)
  //       .order("created_at", { ascending: true });

  //     if (error) throw error;

  //     // Process comments into a tree structure
  //     const commentTree = buildCommentTree(data || []);
  //     setComments(commentTree);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //     toast.error("Failed to load comments");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Function to build a tree structure for comments with parent-child relationships
  // const buildCommentTree = (flatComments: Comment[]): Comment[] => {
  //   const commentMap = new Map<string, Comment>();
  //   const rootComments: Comment[] = [];

  //   // First pass: create a map of all comments by ID
  //   flatComments.forEach((comment) => {
  //     commentMap.set(comment.id, { ...comment, replies: [] });
  //   });

  //   // Second pass: build the tree structure
  //   flatComments.forEach((comment) => {
  //     const processedComment = commentMap.get(comment.id)!;

  //     if (comment.parent_id && commentMap.has(comment.parent_id)) {
  //       // This is a reply - add it to its parent's replies
  //       const parentComment = commentMap.get(comment.parent_id)!;
  //       if (!parentComment.replies) {
  //         parentComment.replies = [];
  //       }
  //       parentComment.replies.push(processedComment);
  //     } else {
  //       // This is a root comment
  //       rootComments.push(processedComment);
  //     }
  //   });

  //   return rootComments;
  // };

  // Helper: Find and update a comment in the nested structure
  // const updateCommentInTree = (
  //   commentId: string,
  //   updater: (comment: Comment) => Comment,
  //   commentsToSearch = [...comments]
  // ): Comment[] => {
  //   return commentsToSearch.map((comment) => {
  //     if (comment.id === commentId) {
  //       return updater(comment);
  //     }

  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: updateCommentInTree(commentId, updater, comment.replies),
  //       };
  //     }

  //     return comment;
  //   });
  // };

  // Helper: Find and remove a comment from the nested structure
  // const removeCommentFromTree = (
  //   commentId: string,
  //   commentsToSearch = [...comments]
  // ): Comment[] => {
  //   // First filter out this comment if it's at the current level
  //   const filteredComments = commentsToSearch.filter(
  //     (comment) => comment.id !== commentId
  //   );

  //   // Then recursively filter out this comment from all replies
  //   return filteredComments.map((comment) => {
  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: removeCommentFromTree(commentId, comment.replies),
  //       };
  //     }
  //     return comment;
  //   });
  // };

  // Function to add a new comment with optimistic update
  // const handleAddComment = async () => {
  //   if (!userData) {
  //     toast.error("Please log in to comment");
  //     return;
  //   }

  //   if (!newComment.trim() || isSubmitting) return;
  //   if (newComment.length > 255) {
  //     toast.error("Comment is too long (maximum 255 characters)");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Create optimistic comment
  //   const optimisticId = `optimistic-${Date.now()}`;
  //   const optimisticComment: Comment = {
  //     id: optimisticId,
  //     blog_id: blogId,
  //     user_id: userData.id,
  //     content: newComment,
  //     parent_id: null,
  //     created_at: new Date().toISOString(),
  //     updated_at: null,
  //     profiles: {
  //       user_id: userData.id,
  //       full_name: userData.fullName,
  //       avatar_url: userData.avatarUrl,
  //     },
  //     optimistic: true,
  //   };

  //   // Add optimistic comment to state
  //   setComments((prev) => [...prev, optimisticComment]);
  //   setNewComment(""); // Clear input immediately for better UX

  //   try {
  //     // Perform actual API call
  //     const { data, error } = await supabase
  //       .from("blog_comments")
  //       .insert({
  //         blog_id: blogId,
  //         user_id: userData.id,
  //         content: optimisticComment.content,
  //         parent_id: null,
  //       })
  //       .select()
  //       .single();

  //     if (error) throw error;

  //     // Replace optimistic comment with real one
  //     setComments((prev) =>
  //       prev.map((comment) =>
  //         comment.id === optimisticId
  //           ? { ...data, profiles: optimisticComment.profiles, replies: [] }
  //           : comment
  //       )
  //     );

  //     toast.success("Comment posted successfully");
  //   } catch (error: any) {
  //     console.error("Error adding comment:", error);
  //     toast.error(error.message || "Failed to post comment");

  //     // Remove optimistic comment on failure
  //     setComments((prev) =>
  //       prev.filter((comment) => comment.id !== optimisticId)
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Function to add a reply with optimistic update
  // const handleAddReply = async (parentId: string) => {
  //   if (!userData) {
  //     toast.error("Please log in to reply");
  //     return;
  //   }

  //   if (!replyText.trim() || isSubmitting) return;
  //   if (replyText.length > 255) {
  //     toast.error("Reply is too long (maximum 255 characters)");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Create optimistic reply
  //   const optimisticId = `optimistic-${Date.now()}`;
  //   const optimisticReply: Comment = {
  //     id: optimisticId,
  //     blog_id: blogId,
  //     user_id: userData.id,
  //     content: replyText,
  //     parent_id: parentId,
  //     created_at: new Date().toISOString(),
  //     updated_at: null,
  //     profiles: {
  //       user_id: userData.id,
  //       full_name: userData.fullName,
  //       avatar_url: userData.avatarUrl,
  //     },
  //     optimistic: true,
  //   };

  //   // Add optimistic reply to parent's replies
  //   setComments((prev) => {
  //     return prev.map((comment) => {
  //       if (comment.id === parentId) {
  //         return {
  //           ...comment,
  //           replies: [...(comment.replies || []), optimisticReply],
  //         };
  //       }

  //       if (comment.replies && comment.replies.length > 0) {
  //         return {
  //           ...comment,
  //           replies: addReplyToComment(
  //             comment.replies,
  //             parentId,
  //             optimisticReply
  //           ),
  //         };
  //       }

  //       return comment;
  //     });
  //   });

  //   setReplyingTo(null);
  //   setReplyText("");

  //   try {
  //     // Perform actual API call
  //     const { data, error } = await supabase
  //       .from("blog_comments")
  //       .insert({
  //         blog_id: blogId,
  //         user_id: userData.id,
  //         content: optimisticReply.content,
  //         parent_id: parentId,
  //       })
  //       .select()
  //       .single();

  //     if (error) throw error;

  //     // Replace optimistic reply with real one
  //     setComments((prev) => {
  //       return prev.map((comment) => {
  //         if (comment.id === parentId) {
  //           return {
  //             ...comment,
  //             replies: (comment.replies || []).map((reply) =>
  //               reply.id === optimisticId
  //                 ? { ...data, profiles: optimisticReply.profiles }
  //                 : reply
  //             ),
  //           };
  //         }

  //         if (comment.replies && comment.replies.length > 0) {
  //           return {
  //             ...comment,
  //             replies: replaceOptimisticReply(
  //               comment.replies,
  //               parentId,
  //               optimisticId,
  //               data,
  //               optimisticReply.profiles
  //             ),
  //           };
  //         }

  //         return comment;
  //       });
  //     });

  //     toast.success("Reply posted successfully");
  //   } catch (error: any) {
  //     console.error("Error adding reply:", error);
  //     toast.error(error.message || "Failed to post reply");

  //     // Remove optimistic reply on failure
  //     setComments((prev) => {
  //       return prev.map((comment) => {
  //         if (comment.id === parentId) {
  //           return {
  //             ...comment,
  //             replies: (comment.replies || []).filter(
  //               (reply) => reply.id !== optimisticId
  //             ),
  //           };
  //         }

  //         if (comment.replies && comment.replies.length > 0) {
  //           return {
  //             ...comment,
  //             replies: removeOptimisticReply(
  //               comment.replies,
  //               parentId,
  //               optimisticId
  //             ),
  //           };
  //         }

  //         return comment;
  //       });
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Helper functions for nested reply operations
  // const addReplyToComment = (
  //   comments: Comment[],
  //   parentId: string,
  //   reply: Comment
  // ): Comment[] => {
  //   return comments.map((comment) => {
  //     if (comment.id === parentId) {
  //       return {
  //         ...comment,
  //         replies: [...(comment.replies || []), reply],
  //       };
  //     }

  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: addReplyToComment(comment.replies, parentId, reply),
  //       };
  //     }

  //     return comment;
  //   });
  // };

  // const replaceOptimisticReply = (
  //   comments: Comment[],
  //   parentId: string,
  //   optimisticId: string,
  //   realData: any,
  //   profiles: any
  // ): Comment[] => {
  //   return comments.map((comment) => {
  //     if (comment.id === parentId) {
  //       return {
  //         ...comment,
  //         replies: (comment.replies || []).map((reply) =>
  //           reply.id === optimisticId ? { ...realData, profiles } : reply
  //         ),
  //       };
  //     }

  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: replaceOptimisticReply(
  //           comment.replies,
  //           parentId,
  //           optimisticId,
  //           realData,
  //           profiles
  //         ),
  //       };
  //     }

  //     return comment;
  //   });
  // };

  // const removeOptimisticReply = (
  //   comments: Comment[],
  //   parentId: string,
  //   optimisticId: string
  // ): Comment[] => {
  //   return comments.map((comment) => {
  //     if (comment.id === parentId) {
  //       return {
  //         ...comment,
  //         replies: (comment.replies || []).filter(
  //           (reply) => reply.id !== optimisticId
  //         ),
  //       };
  //     }

  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: removeOptimisticReply(
  //           comment.replies,
  //           parentId,
  //           optimisticId
  //         ),
  //       };
  //     }

  //     return comment;
  //   });
  // };

  // Function to update a comment with optimistic update
  // const handleUpdateComment = async (commentId: string) => {
  //   if (!userData) {
  //     toast.error("Please log in to edit this comment");
  //     return;
  //   }

  //   if (!editText.trim() || isSubmitting) return;
  //   if (editText.length > 255) {
  //     toast.error("Comment is too long (maximum 255 characters)");
  //     return;
  //   }

  //   // Store original content in case we need to revert
  //   const originalComment = findCommentById(commentId, comments);
  //   if (!originalComment) {
  //     toast.error("Comment not found");
  //     return;
  //   }

  //   const originalContent = originalComment.content;

  //   setIsSubmitting(true);

  //   // Optimistically update the comment
  //   setComments((prev) =>
  //     updateCommentInTree(commentId, (comment) => ({
  //       ...comment,
  //       content: editText,
  //       updated_at: new Date().toISOString(),
  //     }))
  //   );

  //   setEditingComment(null);
  //   setEditText("");

  //   try {
  //     // Verify this is the user's comment
  //     if (originalComment.user_id !== userData.id) {
  //       throw new Error("You can only edit your own comments");
  //     }

  //     // Perform actual API call
  //     const { error } = await supabase
  //       .from("blog_comments")
  //       .update({
  //         content: editText,
  //         updated_at: new Date().toISOString(),
  //       })
  //       .eq("id", commentId)
  //       .eq("user_id", userData.id);

  //     if (error) throw error;

  //     toast.success("Comment updated successfully");
  //   } catch (error: any) {
  //     console.error("Error updating comment:", error);
  //     toast.error(error.message || "Failed to update comment");

  //     // Revert to original content on failure
  //     setComments((prev) =>
  //       updateCommentInTree(commentId, (comment) => ({
  //         ...comment,
  //         content: originalContent,
  //         updated_at: originalComment.updated_at,
  //       }))
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Function to delete a comment with optimistic update
  // const handleDeleteComment = async (commentId: string) => {
  //   if (!userData) {
  //     toast.error("Please log in to delete this comment");
  //     return;
  //   }

  //   if (!confirm("Are you sure you want to delete this comment?")) {
  //     return;
  //   }

  //   // Store the comments tree in case we need to revert
  //   const commentsCopy = [...comments];
  //   const commentToDelete = findCommentById(commentId, comments);

  //   if (!commentToDelete) {
  //     toast.error("Comment not found");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Optimistically remove the comment
  //   setComments((prev) => removeCommentFromTree(commentId));

  //   try {
  //     // Verify this is the user's comment
  //     if (commentToDelete.user_id !== userData.id) {
  //       throw new Error("You can only delete your own comments");
  //     }

  //     // Perform actual API call
  //     const { error } = await supabase
  //       .from("blog_comments")
  //       .delete()
  //       .eq("id", commentId)
  //       .eq("user_id", userData.id);

  //     if (error) throw error;

  //     toast.success("Comment deleted successfully");
  //   } catch (error: any) {
  //     console.error("Error deleting comment:", error);
  //     toast.error(error.message || "Failed to delete comment");

  //     // Revert to original comments on failure
  //     setComments(commentsCopy);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Helper to find a comment by ID in the nested structure
  // const findCommentById = (
  //   commentId: string,
  //   commentsToSearch: Comment[]
  // ): Comment | undefined => {
  //   for (const comment of commentsToSearch) {
  //     if (comment.id === commentId) {
  //       return comment;
  //     }

  //     if (comment.replies && comment.replies.length > 0) {
  //       const found = findCommentById(commentId, comment.replies);
  //       if (found) return found;
  //     }
  //   }

  //   return undefined;
  // };

  // Function to render the comments recursively
  const renderComments = (comments: Comment[] = [], level = 0) => {
    if (!comments.length && level === 0 && !isLoading) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      );
    }

    return comments.map((comment) => (
      <div
        key={comment.id}
        className={cn(
          "mb-4",
          level > 0 && "ml-8 border-l-2 border-gray-100 pl-4",
          comment.optimistic && "opacity-70"
        )}
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.profiles?.avatar_url || "/placeholder.svg"}
            />
            <AvatarFallback>
              {comment.profiles?.full_name.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {comment.profiles?.full_name || "Anonymous"}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), "MMM d, yyyy")}
              </span>
              {comment.updated_at &&
                comment.updated_at !== comment.created_at && (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                )}
              {comment.optimistic && (
                <span className="text-xs text-blue-500">Posting...</span>
              )}
            </div>

            {editingComment === comment.id ? (
              <div className="mt-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  maxLength={255}
                  className="min-h-[80px]"
                />
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    {editText.length}/255 characters
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingComment(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={isSubmitting || !editText.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 px-2 text-xs"
                    onClick={() => {
                      if (!userData) {
                        toast.error("Please log in to reply");
                        return;
                      }
                      setReplyingTo(comment.id);
                      setReplyText("");
                    }}
                    disabled={isSubmitting || comment.optimistic}
                  >
                    <MessageSquare className="size-3 mr-1" />
                    Reply
                  </Button>

                  {userData &&
                    comment.user_id === userData.id &&
                    !comment.optimistic && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0"
                            disabled={isSubmitting}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditText(comment.content);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              </>
            )}

            {replyingTo === comment.id && (
              <div className="mt-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  maxLength={255}
                  className="min-h-[80px]"
                />
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    {replyText.length}/255 characters
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={isSubmitting || !replyText.trim()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Fetch comments on component mount
  // useEffect(() => {
  //   fetchComments();
  // }, [blogId]);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={255}
          className="min-h-[120px]"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-muted-foreground">
            {newComment.length}/255 characters
          </div>
          <Button
            // onClick={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          <span className="ml-2 text-sm text-muted-foreground">
            Loading comments...
          </span>
        </div>
      ) : (
        <div className="space-y-4">{renderComments(comments)}</div>
      )}
    </div>
  );
}
