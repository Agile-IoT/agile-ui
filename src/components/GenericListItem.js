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
