import { visit } from 'unist-util-visit';

export default function remarkColorDirectives() {
  return (tree) => {
    visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], (node) => {
      if (node.name === 'red' || node.name === 'blue' || node.name === 'green' || node.name === 'orange') {
        const color = node.name;
        node.data = {
          hName: 'span',
          hProperties: { style: `color: ${color}` }
        };
      }
    });
  };
}
