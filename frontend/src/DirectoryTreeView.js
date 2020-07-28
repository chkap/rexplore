import React, { useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import path from 'path'
import './DirectoryView.css'

class DirectoryTreeItem extends React.Component {
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
      this.props.updateDir(this.props.indexPath);
      // this.props.setCurDir(this.props.indexPath);
    };
    console.log(`re-render: ${this.props.indexPath}`)
    return (
      <TreeItem nodeId={this.props.indexPath.join()} label={this.props.dirNode.name} onLabelClick={onLabelClick}>
        {childDirs.map((child, index) => {
          return <DirectoryTreeItem key={child.name} dirNode={child} indexPath={this.props.indexPath.concat([index])}
              updateDir={this.props.updateDir} setCurDir={this.props.setCurDir}
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
        <DirectoryTreeItem dirNode={rootNode} indexPath={[]}
            updateDir={this.props.updateDir} setCurDir={this.props.setCurDir}></DirectoryTreeItem>
      </TreeView>
    );
  }
}

export default DirectoryTreeView;
