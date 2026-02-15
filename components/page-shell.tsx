import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 animate-fadeInUp">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl animate-fadeInUp delay-100">
            {description}
          </p>
        </div>
      </section>

      {/* Page Content */}
      <section className="container max-w-6xl py-8 md:py-12 animate-fadeIn delay-200">
        {children}
      </section>
    </>
  );
}
