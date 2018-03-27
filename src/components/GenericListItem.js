/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
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
