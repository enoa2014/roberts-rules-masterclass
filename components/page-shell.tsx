import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  return (
    <div className="container">
      <section className="card">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{description}</p>
        {children}
      </section>
    </div>
  );
}
