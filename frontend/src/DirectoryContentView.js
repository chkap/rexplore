
import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExplorerContext from './context'

class DirectoryContentView extends React.Component {
  static contextType = ExplorerContext;

  constructor(props) {
    super(props);
    this.onClickDirItem = this.onClickDirItem.bind(this);
  }

  onClickDirItem(dirIndex) {
    const clickedIndexPath = [...this.props.indexPath, dirIndex];
    this.context.updateDir(clickedIndexPath);
    this.context.setCurDir(clickedIndexPath);
  }

  render() {
    if(this.props.dirNode === null) {
      return <div>Select a directory first</div>
    }else{
      const dirs = this.props.dirNode.dirs || [];
      const files = this.props.dirNode.files || [];
      const contents = dirs.map( (childNode, idx) => {
          return <ListItem button key={childNode.name} onClick={()=> this.onClickDirItem(idx)}>
            <ListItemText primary={childNode.name} secondary="dir" />
          </ListItem>
        }).concat(files.map(childFile => {
          return <ListItem button key={childFile}> 
            <ListItemText primary={childFile} secondary="file" />
          </ListItem>
        }))
      return (<div>
        <div>{this.props.dirNode.name}</div>
        <List>
          {contents}
        </List>
      </div>)
    }
  }

}

export default DirectoryContentView;

