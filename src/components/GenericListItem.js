import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const GenericListItem = (props) => {
  const styles= {
    bar: {
      backgroundColor: 'white' 
    },

    leftEl: {
      margin: '0px',
      padding: '0px',
      width: '20%'
    }
  }
  return (
    <Toolbar style={styles.bar}>
      <ToolbarGroup key='first' firstChild={true}>
        {props.leftEl}
      </ToolbarGroup>
    <ToolbarGroup key='last' lastChild={true} style={styles.leftEl}>
        {props.rightEl}
      </ToolbarGroup>
    </Toolbar>
  )
}

export default GenericListItem;
