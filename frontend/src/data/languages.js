export const languages = [
  { id: 'javascript', label: 'JavaScript', starter: 'console.log("Hello World");' },
  { id: 'python', label: 'Python', starter: 'print("Hello World")' },
  {
    id: 'c',
    label: 'C',
    starter: '#include <stdio.h>\n\nint main() {\n  printf("Hello World");\n  return 0;\n}',
  },
  {
    id: 'cpp',
    label: 'C++',
    starter: '#include <iostream>\n\nint main() {\n  std::cout << "Hello World";\n  return 0;\n}',
  },
  {
    id: 'java',
    label: 'Java',
    starter:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
  },
  {
    id: 'html',
    label: 'HTML',
    starter: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>',
  },
  { id: 'css', label: 'CSS', starter: 'body {\n  font-family: sans-serif;\n}' },
  { id: 'sql', label: 'SQL', starter: 'SELECT * FROM students;' },
  {
    id: 'verilog',
    label: 'Verilog',
    starter: 'module hello;\n  initial $display("Hello World");\nendmodule',
  },
];

export function getLanguageById(id) {
  return languages.find((l) => l.id === id);
}
