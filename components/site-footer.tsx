export function SiteFooter() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">议起读</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            致力于推广罗伯特议事规则，帮助青少提升公共议事能力与公民素养。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">快速链接</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="/course" className="hover:text-primary transition-colors">课程体系</a></li>
                            <li><a href="/about" className="hover:text-primary transition-colors">关于我们</a></li>
                            <li><a href="/faq" className="hover:text-primary transition-colors">常见问题</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">联系我们</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>邮箱：contact@yiqidu.com</li>
                            <li>微信公众号：议起读</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} 议起读平台. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
