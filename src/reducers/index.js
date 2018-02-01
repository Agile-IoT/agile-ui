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
import { combineReducers } from 'redux';
import {
  devices,
  currentUser,
  entityList,
  groups,
  input,
  schemas,
  form,
  lockFormats,
  policies,
  entityPolicies,
  devicesDiscover,
  messages,
  loading,
  discovery,
  drawer,
  protocols,
  deviceTypes,
  streams,
  localStorage,
  cloudUpload,
  records
} from './entities';

export default combineReducers({
    devices,
    entityList,
    groups,
    input,
    schemas,
    form,
    lockFormats,
    policies,
    entityPolicies,
    currentUser,
    devicesDiscover,
    messages,
    loading,
    discovery,
    drawer,
    protocols,
    deviceTypes,
    streams,
    localStorage,
    cloudUpload,
    records
});
