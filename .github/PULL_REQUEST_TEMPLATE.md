## Summary

Briefly describe what this PR does and why.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / code improvement
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Chore (build, deps, tooling)

## Related Issue

Closes #(issue number)

## Changes Made

- 
- 

## Testing

Describe how you tested the changes:

- [ ] Tested manually in Extension Development Host (F5)
- [ ] 
> packsight@1.0.0 compile
> tsc -p ./ passes with no errors
- [ ] 
> packsight@1.0.0 lint
> eslint src --ext ts


C:\Programmings-code-extenstions\packsight\src	ree\dependencyTreeProvider.ts
  118:22  warning  Missing return type on function  @typescript-eslint/explicit-function-return-type

C:\Programmings-code-extenstions\packsight\src\webview\dashboardHtml.ts
  1392:38  error  Unnecessary escape character: \^  no-useless-escape
  1392:44  error  Unnecessary escape character: \s  no-useless-escape
  1392:64  error  Unnecessary escape character: \d  no-useless-escape
  1392:68  error  Unnecessary escape character: \.  no-useless-escape
  1392:71  error  Unnecessary escape character: \d  no-useless-escape
  1392:75  error  Unnecessary escape character: \.  no-useless-escape
  1392:78  error  Unnecessary escape character: \d  no-useless-escape
  1898:45  error  Unnecessary escape character: \d  no-useless-escape

C:\Programmings-code-extenstions\packsight\src\webview\dashboardPanel.ts
  5:79  error  'invalidateAuditCache' is defined but never used  @typescript-eslint/no-unused-vars

C:\Programmings-code-extenstions\packsight\src\webview\sidebarWebview.ts
  152:22  warning  Missing return type on function  @typescript-eslint/explicit-function-return-type

✖ 11 problems (9 errors, 2 warnings) passes with no warnings

## Screenshots (if applicable)

## Checklist

- [ ] My code follows the project commit convention
- [ ] I have updated the README if user-facing behaviour changed
- [ ] I have added comments for any non-obvious logic
