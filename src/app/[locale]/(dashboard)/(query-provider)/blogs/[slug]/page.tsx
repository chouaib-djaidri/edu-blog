import { ArticleView } from "./_components/article-view";

interface BlogPostPageProps {
  params: {
    slug: string;
    locale: string;
  };
}
const blog = {
  id: "1",
  title: "Exploring Hidden Gems: Travel Smart on a Budget",
  description:
    "Discover practical tips for finding unique destinations, affordable stays, and unforgettable experiences without breaking the bank. Perfect for adventurous travelers seeking authentic journeys.",
  coverImage:
    "https://tripjive.com/wp-content/uploads/2024/03/Hidden-gems-and-underrated-places-to-visit-in-the-US.jpg",
  level: "B1",
  category: ["Travel"],
  categoryLetter: "T",
  author: {
    name: "Chouaib Djaidri",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocI2v5WwT8Sg1RE5j1gsdp3Tn91BM51gd566tFe8Pa_lo9_MPtQ=s393-c-no",
    initials: "C",
  },
  publishedAt: "2025-05-24T21:05:00+00:00",
  stats: {
    likes: 15,
    comments: 8,
  },
  isBookmarked: false,
};

export default async function Page({}: BlogPostPageProps) {
  // const supabase = await supabaseServer();

  //   const { data: blog, error: blogError } = await supabase
  //     .from('blogs')
  //     .select(`
  //       id,
  //       title,
  //       slug,
  //       description,
  //       content,
  //       cover_url,
  //       level,
  //       created_at,
  //       updated_at,
  //       user_id
  //     `)
  //     .eq('slug', slug)
  //     .single();

  //   if (blogError || !blog) {
  //     console.error('Blog fetch error:', blogError);
  //     notFound();
  //   }

  // Get the author's profile info
  // const { data: authorProfile } = await supabase
  //   .from('profiles')
  //   .select('full_name, avatar_url')
  //   .eq('user_id', blog.user_id)
  //   .single();

  // Format categories for display

  const article = {
    ...blog,
    authorName: "Chouaib Djaidri",
    authorAvatar:
      "https://lh3.googleusercontent.com/a/ACg8ocI2v5WwT8Sg1RE5j1gsdp3Tn91BM51gd566tFe8Pa_lo9_MPtQ=s393-c-no",
  };

  return <ArticleView article={article} />;
}

// Helper function to render blog content from JSON to React elements
// function renderBlogContent(content: any): React.ReactNode {
//   // If content is already a React node (from mock data), return as is
//   if (typeof content === "object" && content?.props) {
//     return content;
//   }

//   // If content is a JSON object (from database), we need to render it
//   if (typeof content === "object" && content?.type === "doc") {
//     return renderProseMirrorContent(content);
//   }

//   // If content is a string, render as paragraph
//   if (typeof content === "string") {
//     return <p>{content}</p>;
//   }

//   // Fallback
//   return <p>Content could not be loaded.</p>;
// }

// Function to render ProseMirror/TipTap JSON content to React elements
// function renderProseMirrorContent(doc: any): React.ReactNode {
//   if (!doc || !doc.content) {
//     return <p>No content available.</p>;
//   }

//   return (
//     <div className="prose-content">
//       {doc.content.map((node: any, index: number) => renderNode(node, index))}
//     </div>
//   );
// }

// Recursive function to render individual nodes
// function renderNode(node: any, key: number): React.ReactNode {
//   if (!node || !node.type) {
//     return null;
//   }

//   switch (node.type) {
//     case "paragraph":
//       return (
//         <p key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </p>
//       );

//     case "heading":
//       const level = node.attrs?.level || 1;
//       const HeadingTag =
//         `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements;
//       return (
//         <HeadingTag key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </HeadingTag>
//       );

//     case "bulletList":
//       return (
//         <ul key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </ul>
//       );

//     case "orderedList":
//       return (
//         <ol key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </ol>
//       );

//     case "listItem":
//       return (
//         <li key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </li>
//       );

//     case "blockquote":
//       return (
//         <blockquote key={key}>
//           {node.content
//             ? node.content.map((child: any, childIndex: number) =>
//                 renderNode(child, `${key}-${childIndex}`)
//               )
//             : ""}
//         </blockquote>
//       );

//     case "codeBlock":
//       const language = node.attrs?.language || "";
//       return (
//         <pre key={key} className={language ? `language-${language}` : ""}>
//           <code>
//             {node.content
//               ? node.content.map((child: any, childIndex: number) =>
//                   renderNode(child, `${key}-${childIndex}`)
//                 )
//               : ""}
//           </code>
//         </pre>
//       );

//     case "text":
//       let textContent = node.text || "";

//       // Apply text marks (bold, italic, etc.)
//       if (node.marks && node.marks.length > 0) {
//         return node.marks.reduce((content: React.ReactNode, mark: any) => {
//           switch (mark.type) {
//             case "bold":
//               return <strong key={key}>{content}</strong>;
//             case "italic":
//               return <em key={key}>{content}</em>;
//             case "code":
//               return <code key={key}>{content}</code>;
//             case "link":
//               return (
//                 <a
//                   key={key}
//                   href={mark.attrs?.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {content}
//                 </a>
//               );
//             default:
//               return content;
//           }
//         }, textContent);
//       }

//       return textContent;

//     case "hardBreak":
//       return <br key={key} />;

//     case "horizontalRule":
//       return <hr key={key} />;

//     case "image":
//       return (
//         <img
//           key={key}
//           src={node.attrs?.src}
//           alt={node.attrs?.alt || ""}
//           title={node.attrs?.title || ""}
//           className="max-w-full h-auto"
//         />
//       );

//     default:
//       // For unknown node types, try to render content if it exists
//       if (node.content) {
//         return (
//           <div key={key}>
//             {node.content.map((child: any, childIndex: number) =>
//               renderNode(child, `${key}-${childIndex}`)
//             )}
//           </div>
//         );
//       }
//       return null;
//   }
// }
