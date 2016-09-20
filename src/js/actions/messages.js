import { action } from './utils'

export const newMessage = message => action('MESSAGE', {message})
