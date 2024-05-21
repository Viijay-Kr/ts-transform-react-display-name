import type * as ts from "typescript";
import type { PluginConfig, TransformerExtras } from "ts-patch";

export default function (
  _program: ts.Program,
  config: PluginConfig,
  { ts: tsInstance }: TransformerExtras
) {
  return (ctx: ts.TransformationContext) => {
    const { factory } = ctx;
    return (sourceFile: ts.SourceFile) => {
      const displayNames: Array<ts.ExpressionStatement> = [];
      const prefix = config.prefix ? `${config.prefix}_` : "";
      function createDisplayNameStatements(
        parent: ts.VariableDeclaration | ts.FunctionDeclaration
      ) {
        if (parent.name) {
          const displayNameNode = factory.createExpressionStatement(
            factory.createBinaryExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(parent.name.getText()),
                factory.createIdentifier("displayName")
              ),
              factory.createToken(tsInstance.SyntaxKind.EqualsToken),
              factory.createStringLiteral(`${prefix}${parent.name.getText()}`)
            )
          );
          displayNames.push(displayNameNode);
        }
      }

      function scanFunctionBody(
        body: ts.Node,
        parent: ts.VariableDeclaration | ts.FunctionDeclaration
      ) {
        const functionDecls: ts.FunctionDeclaration[] = [];
        const variableDecls: ts.VariableDeclaration[] = [];

        function scanExpressionUntilJSX(node: ts.Node) {
          if (tsInstance.isJsxFragment(node) || tsInstance.isJsxElement(node)) {
            createDisplayNameStatements(parent);
            return true;
          }
          if (tsInstance.isParenthesizedExpression(node)) {
            scanExpressionUntilJSX(node.expression);
          }
          if (tsInstance.isBinaryExpression(node)) {
            scanExpressionUntilJSX(node.right);
          }
          if (tsInstance.isConditionalExpression(node)) {
            if (scanExpressionUntilJSX(node.whenTrue)) return;
            if (scanExpressionUntilJSX(node.whenFalse)) return;
          }

          if (tsInstance.isCallExpression(node)) {
            const fnDecl = functionDecls.find((fn) => {
              if (fn.name && tsInstance.isIdentifier(node.expression)) {
                return fn.name.getText() === node.expression.getText();
              }
              return false;
            });
            const varDecl = variableDecls.find((decl) => {
              if (
                decl.initializer &&
                tsInstance.isArrowFunction(decl.initializer)
              ) {
                if (
                  decl.name &&
                  tsInstance.isIdentifier(decl.name) &&
                  tsInstance.isIdentifier(node.expression)
                ) {
                  return decl.name.getText() === node.expression.getText();
                }
              }

              return false;
            });

            if (fnDecl && fnDecl.body) scanFunctionBody(fnDecl.body, parent);
            if (
              varDecl &&
              varDecl.initializer &&
              tsInstance.isArrowFunction(varDecl.initializer)
            )
              if (tsInstance.isConciseBody(varDecl.initializer.body))
                scanFunctionBody(varDecl.initializer.body, parent);
          }
        }
        if (tsInstance.isBlock(body)) {
          if (body.statements.length) {
            body.statements.forEach((stmt) => {
              if (tsInstance.isFunctionDeclaration(stmt))
                functionDecls.push(stmt);
              if (tsInstance.isVariableStatement(stmt)) {
                variableDecls.push(
                  ...stmt.declarationList.declarations.map((it) => it)
                );
              }

              if (tsInstance.isReturnStatement(stmt))
                if (stmt.expression) scanExpressionUntilJSX(stmt.expression);
            });
          }
        } else {
          scanExpressionUntilJSX(body);
        }
      }

      function scanArrowFunction(
        node: ts.ArrowFunction,
        parent: ts.VariableDeclaration
      ) {
        if (tsInstance.isConciseBody(node.body))
          scanFunctionBody(node.body, parent);
      }

      function scanVariableDecl(node: ts.VariableDeclaration) {
        if (node.initializer) {
          if (tsInstance.isArrowFunction(node.initializer))
            scanArrowFunction(node.initializer, node);

          if (tsInstance.isFunctionExpression(node.initializer))
            scanFunctionBody(node.initializer.body, node);

          if (tsInstance.isCallExpression(node.initializer))
            node.initializer.arguments.forEach((arg) => {
              if (tsInstance.isArrowFunction(arg)) scanArrowFunction(arg, node);

              if (tsInstance.isFunctionExpression(arg))
                scanFunctionBody(arg.body, node);
            });
        }
      }

      function scanFunctionDecl(node: ts.FunctionDeclaration) {
        if (node.body) scanFunctionBody(node.body, node);
      }

      sourceFile.statements.forEach((statement) => {
        if (tsInstance.isVariableStatement(statement)) {
          if (tsInstance.isVariableDeclarationList(statement.declarationList)) {
            statement.declarationList.declarations.forEach(scanVariableDecl);
          }
        }
        if (tsInstance.isFunctionDeclaration(statement))
          scanFunctionDecl(statement);
      });

      const newSourceFile = factory.updateSourceFile(sourceFile, [
        ...sourceFile.statements,
        ...displayNames,
      ]);

      return newSourceFile;
    };
  };
}
