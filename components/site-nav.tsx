import Link from "next/link";

const links = [
  ["课程总览", "/course"],
  ["关于与报名", "/about"],
  ["FAQ", "/faq"],
  ["登录", "/login"],
  ["注册", "/register"],
];

export function SiteNav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/">
          议起读平台
        </Link>
        {links.map(([label, href]) => (
          <Link className="link" key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
