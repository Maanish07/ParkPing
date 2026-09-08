import { QuickAlertTemplate } from './types';

export const QUICK_ALERTS: QuickAlertTemplate[] = [
  {
    id: 'blocking',
    label: 'Car Blocking Way',
    iconName: 'Car',
    shortDesc: 'Need you to move your vehicle urgently',
    defaultMessage: 'Hi, your vehicle is blocking my car/driveway. Please move it as soon as possible.',
    urgency: 'high',
  },
  {
    id: 'lights_on',
    label: 'Lights Left ON',
    iconName: 'Lightbulb',
    shortDesc: 'Headlights or hazard lights are active',
    defaultMessage: 'Hi, your vehicle headlights or hazard lights are currently switched ON. Please turn them off to prevent battery drain.',
    urgency: 'medium',
  },
  {
    id: 'window_open',
    label: 'Window / Door Open',
    iconName: 'ShieldAlert',
    shortDesc: 'Window is rolled down or door unlocked',
    defaultMessage: 'Hi, I noticed that your vehicle window is rolled down / door appears open. Sending this to keep your vehicle secure.',
    urgency: 'high',
  },
  {
    id: 'alarm',
    label: 'Alarm Ringing',
    iconName: 'BellRing',
    shortDesc: 'Security siren or horn is sounding',
    defaultMessage: 'Hi, your car alarm is ringing continuously. Please check your vehicle.',
    urgency: 'high',
  },
  {
    id: 'towing',
    label: 'Towing / Fine Alert',
    iconName: 'AlertTriangle',
    shortDesc: 'Traffic police or crane is in the area',
    defaultMessage: 'Hi, caution: Traffic police/towing authority is checking vehicles in this area. Move your car to avoid a penalty.',
    urgency: 'high',
  },
  {
    id: 'custom',
    label: 'Custom Message',
    iconName: 'MessageSquare',
    shortDesc: 'Type a specific urgent note to the owner',
    defaultMessage: '',
    urgency: 'normal',
  },
];
