const start = "start"
export type StartMessage = {
  type: typeof start
  options: StartOptions
}

export type StartOptions = {
  withScoreboard: boolean
}

export function createStartMessage(options: StartOptions): StartMessage {
  return {
    type: start,
    options
  }
}

export function isMessageStartMessage(message: any): message is StartMessage {
  return message.type === start
}

// For start debug mode.
const test = "test"
export type TestMessage = {
  type: typeof test
}

export function createTestMessage(): TestMessage {
  return {
    type: test
  }
}

export function isMessageTestMessage(message: any): message is TestMessage {
  return message.type === test
}

// For replay, this game uses three kinds of messages.
// 1. RequestReplayToBackgroundMessage
// 2. ReplayIsConfirmedOnBackgroundMessage
// 3. ContentIsReadyMessage
const requestReplayToBackground = "requestReplayToBackground"
type RequestReplayToBackgroundMessage = {
  type: typeof requestReplayToBackground
  options: StartOptions
}

export function createRequestReplayToBackgroundMessage(
  options: StartOptions
): RequestReplayToBackgroundMessage {
  return {
    type: requestReplayToBackground,
    options
  }
}

export function isMessageRequestReplayToBackgroundMessage(
  message: any
): message is RequestReplayToBackgroundMessage {
  return message.type === requestReplayToBackground
}

const replayIsConfirmedOnBackground = "replayIsConfirmedOnBackground"
export type ReplayIsConfirmedOnBackgroundMessage = {
  type: typeof replayIsConfirmedOnBackground
}

export function createReplayIsConfirmedOnBackgroundMessage(): ReplayIsConfirmedOnBackgroundMessage {
  return {
    type: replayIsConfirmedOnBackground
  }
}

export function isMessageReplayIsConfirmedOnBackgroundMessage(
  message: any
): message is ReplayIsConfirmedOnBackgroundMessage {
  return message.type === replayIsConfirmedOnBackground
}

const contentIsReady = "contentIsReady"
export type ContentIsReadyMessage = {
  type: typeof contentIsReady
}

export function createContentIsReadyMessage(): ContentIsReadyMessage {
  return {
    type: contentIsReady
  }
}

export function isMessageContentIsReadyMessage(
  message: any
): message is ContentIsReadyMessage {
  return message.type === contentIsReady
}
