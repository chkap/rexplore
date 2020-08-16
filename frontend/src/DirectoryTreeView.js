import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExplorerContext from './context'

import './DirectoryView.css'


class DirectoryTreeItem extends React.Component {

  static contextType = ExplorerContext;

  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.dirNode !== nextProps.dirNode){
      return true;
    }
    for( let i = 0; i < this.props.indexPath.length; i++) {
      if (this.props.indexPath[i] !== nextProps.indexPath[i]) {
        return true;
      }
    }
    return false;
  }

  render() {

    const childDirs = this.props.dirNode.dirs || [];
    const onLabelClick = () => {
      this.context.updateDir(this.props.indexPath);
      this.context.setCurDir(this.props.indexPath);
    };
    console.log(`re-render: ${this.props.indexPath}`)
    return (
      <TreeItem nodeId={this.props.indexPath.join()} label={this.props.dirNode.name} onLabelClick={onLabelClick}>
        {childDirs.map((child, index) => {
          return <DirectoryTreeItem key={child.name} dirNode={child} indexPath={this.props.indexPath.concat([index])}
            ></DirectoryTreeItem>
        })}
      </TreeItem>
    )
  }
}

class DirectoryTreeView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const rootNode = this.props.rootNode;
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}>
        <DirectoryTreeItem dirNode={rootNode} indexPath={[]}></DirectoryTreeItem>
      </TreeView>
    );
  }
}

export default DirectoryTreeView;
