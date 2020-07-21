import React, { useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import path from 'path'
import './DirectoryView.css'

class DirectoryItem extends React.PureComponent {
  constructor(props){
    super(props);
    this.updated = false;
  }

  render() {

    const childDirs = this.props.dirNode.dirs || [];
    const onLabelClick = () => {
      if (!this.updated) {
        this.props.updateDir(this.props.indexPath);
        this.updated = true;
      }
      this.props.setCurDir(this.props.indexPath);
    };
    return (
      <TreeItem nodeId={this.props.indexPath.join()} label={this.props.dirNode.name} onLabelClick={onLabelClick}>
        {childDirs.map((child, index) => {
          return <DirectoryItem key={child.name} dirNode={child} indexPath={this.props.indexPath.concat([index])}
              updateDir={this.props.updateDir} setCurDir={this.props.setCurDir}
            ></DirectoryItem>
        })}
      </TreeItem>
    )
  }
}

class DirectoryView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const rootNode = this.props.rootNode;
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}>
        <DirectoryItem dirNode={rootNode} indexPath={[]}
            updateDir={this.props.updateDir} setCurDir={this.props.setCurDir}></DirectoryItem>
      </TreeView>
    );
  }
}

export default DirectoryView;
