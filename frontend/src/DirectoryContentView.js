
import React, { useState } from 'react';
import path from 'path'

import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Link from '@material-ui/core/Link'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import HomeIcon from '@material-ui/icons/Home';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import ExplorerContext from './context'
import util from './util'

class DirectoryContentView extends React.Component {
  static contextType = ExplorerContext;

  constructor(props) {
    super(props);
    this.onClickDirItem = this.onClickDirItem.bind(this);
    this.state = {
      curSelectedImgIndex: null,
    }
  }

  onClickDirItem(dirIndex) {
    const clickedIndexPath = [...this.props.indexPath, dirIndex];
    this.context.updateDir(clickedIndexPath);
    this.context.setCurDir(clickedIndexPath);
  }

  onClickFileItem(fileIndex) {
    const imgPathArray = this.getImagePathArray();
    const curImageName = this.getCurDirNode().files[fileIndex];
    const selected = imgPathArray.indexOf(curImageName);
    if(selected !== -1){
      this.setState({curSelectedImgIndex: selected});
      console.log('Launch lightbox')
    }
    console.log('File clicked')
  }

  getCurDirNode() {
    let curNode = this.props.rootNode;
    for(const index of this.props.indexPath) {
      curNode = curNode.dirs[index];
    }
    return curNode;
  }

  getIndexName() {
    let curNode = this.props.rootNode;
    const segments = [];
    for(const index of this.props.indexPath) {
      curNode = curNode.dirs[index]
      segments.push(curNode.name);
    }
    return segments;
  }

  getImagePathArray() {
    const pathArray = [];
    for(let fileName of this.getCurDirNode().files || []) {
      if(util.isImageByName(fileName)){
        pathArray.push(fileName);
      }
    }
    console.log(`Imgs: ${pathArray.length}`);
    
    return pathArray;
  }

  renderLightbox() {
    const imgPathArray = this.getImagePathArray();

    const getImageURL = (index) =>{
      let indexMod = index % imgPathArray.length;
      const pathSegments = [...this.getIndexName(), imgPathArray[indexMod]];
      const URLPath = '/files/' + pathSegments.map(encodeURIComponent).join('/');
      console.log(`Img: ${URLPath}`);
      return URLPath;
    }

    return (this.state.curSelectedImgIndex !== null && (
      <Lightbox
        imageTitle={`${this.state.curSelectedImgIndex}/${imgPathArray.length}: ${imgPathArray[this.state.curSelectedImgIndex]}`}
        mainSrc={getImageURL(this.state.curSelectedImgIndex)}
        nextSrc={getImageURL(this.state.curSelectedImgIndex + 1)}
        prevSrc={getImageURL(this.state.curSelectedImgIndex - 1)}
        onCloseRequest={() => this.setState({ curSelectedImgIndex: null })}
        onMovePrevRequest={() =>
          this.setState({
            curSelectedImgIndex: (this.state.curSelectedImgIndex + imgPathArray.length - 1) % imgPathArray.length,
          })
        }
        onMoveNextRequest={() =>
          this.setState({
            curSelectedImgIndex: (this.state.curSelectedImgIndex + 1) % imgPathArray.length,
          })
        }
      />
    ));
  }

  render() {
    if(this.props.indexPath === null) {
      return <div>Select a directory first</div>
    }else{
      const curNode = this.getCurDirNode();
      const indexName = this.getIndexName();
      const dirs = curNode.dirs || [];
      const files = curNode.files || [];
      const contents = dirs.map( (childNode, idx) => {
          return <ListItem button key={childNode.name} onClick={()=> this.onClickDirItem(idx)}>
            <ListItemText primary={childNode.name} secondary="dir" />
          </ListItem>
        }).concat(files.map((childFile, idx) => {
          return <ListItem button key={childFile} onClick={() => this.onClickFileItem(idx)}>
            <ListItemText primary={childFile} secondary="file" />
          </ListItem>
        }))
      return (<div>
        <DirectoryNavigation indexPath={this.props.indexPath} indexName={indexName}></DirectoryNavigation>
        <List>
          {contents}
        </List>
        {this.renderLightbox()}
      </div>)
    }
  }

}

class DirectoryNavigation extends React.PureComponent {

  static contextType = ExplorerContext;

  constructor(props) {
    super(props);

    this.onClickUpward = this.onClickUpward.bind(this);
  }

  onClickUpward() {
    const parentPath = this.props.indexPath.slice(0, -1);
    this.context.setCurDir(parentPath);
    return false;
  }

  render() {

    const navItems = [
      <Link key={-1} color='inherit' href='#' onClick={()=>{
        this.context.setCurDir([]);
      }}>
        <HomeIcon color='primary'></HomeIcon>
      </Link>
    ].concat(this.props.indexName.map((name, idx) => {
      if(idx === this.props.indexName.length - 1) {
        return <Typography key={idx} color='textPrimary'> {name} </Typography>;
      }else{
        return <Link key={idx} color='inherit' href='#' onClick={()=>{
          const clickedPath = this.props.indexPath.slice(0, idx+1);
          this.context.setCurDir(clickedPath);
        }}> {name} </Link>
      }
    }))

    return (
      <Box display='flex' flexDirection='row'>
        <Box flexGrow={0} flexShrink={0}>
            <Link href='#' onClick={this.onClickUpward} >
              <ArrowUpwardIcon color='primary'></ArrowUpwardIcon>
            </Link>
        </Box>
        <Box flexGrow={1} flexShrink={1}>
          <Breadcrumbs maxItems={6} itemsAfterCollapse={3} itemsBeforeCollapse={1}>
            {navItems}
          </Breadcrumbs>
        </Box>
      </Box>)
  }
}


export default DirectoryContentView;

