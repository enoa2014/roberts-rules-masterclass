import Link from "next/link";

import { PageShell } from "@/components/page-shell";

export default function HomePage() {
  return (
    <PageShell
      title="议起读课程学习与互动平台"
      description="当前已进入开发阶段。首发将支持统一登录、邀请码资格、课堂互动与课后闭环。"
    >
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="button" href="/course">
          查看课程总览
        </Link>
        <Link className="button" href="/login">
          登录
        </Link>
      </div>
    </PageShell>
  );
}
