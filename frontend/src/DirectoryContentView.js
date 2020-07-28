
import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

function DirectoryContentView({ dirNode }) {
  if(dirNode === null) {
    return <div>Select a directory first</div>
  }else{
    const dirs = dirNode.dirs || [];
    const files = dirNode.files || [];
    const contents = dirs.map(childNode => {
        return <ListItem button key={childNode.name}>
          <ListItemText primary={childNode.name} secondary="dir" />
        </ListItem>
      }).concat(files.map(childFile => {
        return <ListItem button key={childFile}> 
          <ListItemText primary={childFile} secondary="file" />
        </ListItem>
      }))
    return (<div>
      <div>{dirNode.name}</div>
      <List>
        {contents}
      </List>
    </div>)
  }
  
}

export default DirectoryContentView;

