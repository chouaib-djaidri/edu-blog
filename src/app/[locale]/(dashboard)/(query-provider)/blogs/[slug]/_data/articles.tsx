import type { Article } from "../_types/blog";

export const articles: Article[] = [
  {
    id: "c41d4c64-1801-4627-b2eb-da450f072fa2",
    slug: "getting-started-with-react",
    title: "Getting Started with React: A Beginner's Guide",
    excerpt: "Learn the basics of React and start building your first component-based application.",
    content: (
      <>
        <p>
          React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible, making
          it one of the most popular frontend libraries today. In this guide, we'll cover the basics of React and help
          you get started with building your first component-based application.
        </p>
        <p>
          One of the key concepts in React is components. Components are reusable pieces of code that return React
          elements describing what should appear on the screen. They can be as simple as a button or as complex as an
          entire page.
        </p>
        <p>
          To create a React component, you can use either a function or a class. Functional components are simpler and
          more concise, while class components provide additional features like state and lifecycle methods. However,
          with the introduction of Hooks in React 16.8, functional components can now do everything that class
          components can do.
        </p>
        <p>Here's an example of a simple functional component:</p>
        <pre>
          <code>
            {`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}`}
          </code>
        </pre>
        <p>
          React's component-based architecture makes it easy to build complex UIs from small, isolated pieces of code.
          This approach also promotes code reuse and separation of concerns, making your codebase more maintainable and
          easier to understand.
        </p>
      </>
    ),
    category: "React",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3",
    publishedAt: "2023-05-15",
    bookmarked: false,
    favorited: false,
  },
  {
    id: "2",
    slug: "mastering-nextjs-app-router",
    title: "Mastering Next.js App Router: A Comprehensive Guide",
    excerpt:
      "Explore the powerful features of Next.js App Router and learn how to build efficient, server-rendered React applications.",
    content: (
      <>
        <p>
          Next.js has revolutionized the way we build React applications by providing a framework that handles routing,
          server-side rendering, and many other features out of the box. With the introduction of the App Router in
          Next.js 13, building complex applications has become even more intuitive and powerful.
        </p>
        <p>
          The App Router is a new routing system that uses a file-system based router built on top of Server Components.
          It supports layouts, nested routing, loading states, error handling, and more. This approach allows for more
          intuitive and organized code structure, making it easier to understand and maintain your application.
        </p>
        <p>
          One of the key advantages of the App Router is its support for Server Components. Server Components allow you
          to render components on the server, reducing the amount of JavaScript sent to the client and improving
          performance. This is especially useful for components that don't require client-side interactivity.
        </p>
        <p>Here's an example of a simple page component using the App Router:</p>
        <pre>
          <code>
            {`// app/blog/page.tsx
export default function BlogPage() {
  return (
    <div>
      <h1>Welcome to my blog</h1>
      <p>This is a blog built with Next.js App Router</p>
    </div>
  );
}`}
          </code>
        </pre>
        <p>
          The App Router also introduces new concepts like layouts, which allow you to share UI between multiple pages,
          and loading states, which provide a way to show a loading indicator while the page is being rendered on the
          server.
        </p>
      </>
    ),
    category: "Next.js",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3",
    publishedAt: "2023-06-22",
    liked: false,
    favorited: false,
  },
  {
    id: "3",
    slug: "tailwind-css-best-practices",
    title: "Tailwind CSS Best Practices for Modern Web Development",
    excerpt: "Learn how to use Tailwind CSS effectively and build beautiful, responsive websites with less effort.",
    content: (
      <>
        <p>
          Tailwind CSS has gained immense popularity in recent years due to its utility-first approach to styling.
          Unlike traditional CSS frameworks that provide pre-designed components, Tailwind gives you low-level utility
          classes that let you build completely custom designs without ever leaving your HTML.
        </p>
        <p>
          One of the main advantages of Tailwind is its flexibility. You're not constrained by predefined components or
          styles, which means you can create unique designs that match your brand or project requirements exactly. This
          flexibility comes without sacrificing productivity, as Tailwind's utility classes are designed to be
          composable, allowing you to build complex components quickly.
        </p>
        <p>Here are some best practices for using Tailwind CSS effectively:</p>
        <ol>
          <li>
            <strong>Use the @apply directive for repeated patterns:</strong> If you find yourself repeating the same set
            of utility classes in multiple places, consider extracting them into a CSS class using the @apply directive.
          </li>
          <li>
            <strong>Leverage Tailwind's configuration:</strong> Tailwind is highly customizable. You can extend or
            override the default configuration to match your design system.
          </li>
          <li>
            <strong>Optimize for production:</strong> Tailwind can generate a lot of CSS classes. Make sure to use
            PurgeCSS in production to remove unused styles and reduce the file size.
          </li>
        </ol>
        <p>
          Tailwind's approach to CSS might seem unconventional at first, especially if you're used to writing
          traditional CSS or using component-based frameworks. However, once you get used to it, you'll find that it can
          significantly speed up your development process and make your codebase more maintainable.
        </p>
      </>
    ),
    category: "CSS",
    coverImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3",
    publishedAt: "2023-07-10",
    liked: true,
    favorited: false,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
