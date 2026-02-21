import os
import re

themes = ["classic", "charcoal", "copper", "festival", "mint"]
for theme in themes:
    path = f"/home/ctyun/work/tttt/apps/ecs/components/themes/{theme}/views/CourseView.tsx"
    if not os.path.exists(path): continue
    
    with open(path, "r") as f:
        c = f.read()
    
    # 1. replace ` cg-delay-${(i + 3) * 100}` (or any prefix) and append inline style if missing
    def repl1(m):
        expr = m.group(1)
        return ''
        
    lines = c.split('\n')
    for i in range(len(lines)):
        # Match something like ` mc-delay-${(i + 3) * 100}`
        m = re.search(r' (?:mc|cg|cl|fc)?-?delay-\$\{\(([^}]+)\)\}', lines[i])
        if m:
            expr = m.group(1)
            # Remove the matched class
            lines[i] = lines[i].replace(m.group(0), '')
            # Inject style if missing
            if 'style={{ animationDelay' not in lines[i]:
                # find the end of className attribute, which is usually `}` before `>`
                lines[i] = re.sub(r'(className=\{`[^`]+`\})', r'\1 style={{ animationDelay: `${' + expr + '}ms` }}', lines[i])
                lines[i] = re.sub(r'(className="[^"]+")', r'\1 style={{ animationDelay: `${' + expr + '}ms` }}', lines[i])

    with open(path, "w") as f:
        f.write('\n'.join(lines))
    print(f"Fixed {path}")
