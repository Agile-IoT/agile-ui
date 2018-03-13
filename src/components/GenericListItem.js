/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const GenericListItem = (props) => {
  const styles = props.style ? props.style : {
    bar: {
      backgroundColor: 'white' 
    },
    rightEl: {
      margin: '0px',
      padding: '0px'
    }
  }
  return (
    <Toolbar style={styles.bar}>
      <ToolbarGroup key='first' firstChild={true} style={styles.leftEl}>
        {props.leftEl}
      </ToolbarGroup>

      <ToolbarGroup key='last' lastChild={true} style={styles.rightEl}>
        {props.rightEl}
      </ToolbarGroup>
    </Toolbar>
  )
}

export default GenericListItem;
