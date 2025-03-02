/// <reference types="node" />
import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import WebSocket from 'isomorphic-ws';
import { Channel } from './channel';
import { ClientState } from './client_state';
import { StableWSConnection } from './connection';
import { TokenManager } from './token_manager';
import { WSConnectionFallback } from './connection_fallback';
import { APIResponse, AppSettings, AppSettingsAPIResponse, BaseDeviceFields, BannedUsersFilters, BannedUsersPaginationOptions, BannedUsersResponse, BannedUsersSort, BanUserOptions, BlockList, BlockListResponse, ChannelAPIResponse, ChannelData, ChannelFilters, ChannelMute, ChannelOptions, ChannelSort, CheckPushResponse, CheckSQSResponse, Configs, ConnectAPIResponse, CreateChannelOptions, CreateChannelResponse, CreateCommandOptions, CreateCommandResponse, CustomPermissionOptions, DeleteCommandResponse, Device, EndpointName, Event, EventHandler, ExportChannelOptions, ExportChannelRequest, ExportChannelResponse, ExportChannelStatusResponse, MessageFlagsFilters, MessageFlagsPaginationOptions, MessageFlagsResponse, FlagMessageResponse, FlagUserResponse, GetChannelTypeResponse, GetCommandResponse, GetRateLimitsResponse, ListChannelResponse, ListCommandsResponse, LiteralStringForUnion, Logger, MarkChannelsReadOptions, MessageFilters, MessageResponse, Mute, MuteUserOptions, MuteUserResponse, OwnUserResponse, PartialMessageUpdate, PartialUserUpdate, PermissionAPIResponse, PermissionsAPIResponse, PushProvider, ReactionResponse, SearchOptions, SearchAPIResponse, SendFileAPIResponse, StreamChatOptions, TestPushDataInput, TestSQSDataInput, TokenOrProvider, UnBanUserOptions, UR, UpdateChannelOptions, UpdateChannelResponse, UpdateCommandOptions, UpdateCommandResponse, UpdatedMessage, UpdateMessageAPIResponse, UserCustomEvent, UserFilters, UserOptions, UserResponse, UserSort, SegmentData, Segment, Campaign, CampaignData, OGAttachment, TaskStatus, DeleteUserOptions, TaskResponse } from './types';
import { InsightMetrics } from './insights';
export declare class StreamChat<AttachmentType extends UR = UR, ChannelType extends UR = UR, CommandType extends string = LiteralStringForUnion, EventType extends UR = UR, MessageType extends UR = UR, ReactionType extends UR = UR, UserType extends UR = UR> {
    private static _instance?;
    _user?: OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>;
    activeChannels: {
        [key: string]: Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    };
    anonymous: boolean;
    axiosInstance: AxiosInstance;
    baseURL?: string;
    browser: boolean;
    cleaningIntervalRef?: NodeJS.Timeout;
    clientID?: string;
    configs: Configs<CommandType>;
    key: string;
    listeners: {
        [key: string]: Array<(event: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>) => void>;
    };
    logger: Logger;
    /**
     * When network is recovered, we re-query the active channels on client. But in single query, you can recover
     * only 30 channels. So its not guaranteed that all the channels in activeChannels object have updated state.
     * Thus in UI sdks, state recovery is managed by components themselves, they don't rely on js client for this.
     *
     * `recoverStateOnReconnect` parameter can be used in such cases, to disable state recovery within js client.
     * When false, user/consumer of this client will need to make sure all the channels present on UI by
     * manually calling queryChannels endpoint.
     */
    recoverStateOnReconnect?: boolean;
    mutedChannels: ChannelMute<ChannelType, CommandType, UserType>[];
    mutedUsers: Mute<UserType>[];
    node: boolean;
    options: StreamChatOptions;
    secret?: string;
    setUserPromise: ConnectAPIResponse<ChannelType, CommandType, UserType> | null;
    state: ClientState<UserType>;
    tokenManager: TokenManager<UserType>;
    user?: OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>;
    userAgent?: string;
    userID?: string;
    wsBaseURL?: string;
    wsConnection: StableWSConnection<ChannelType, CommandType, UserType, AttachmentType, EventType, MessageType, ReactionType> | null;
    wsFallback?: WSConnectionFallback<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    wsPromise: ConnectAPIResponse<ChannelType, CommandType, UserType> | null;
    consecutiveFailures: number;
    insightMetrics: InsightMetrics;
    defaultWSTimeoutWithFallback: number;
    defaultWSTimeout: number;
    /**
     * Initialize a client
     *
     * **Only use constructor for advanced usages. It is strongly advised to use `StreamChat.getInstance()` instead of `new StreamChat()` to reduce integration issues due to multiple WebSocket connections**
     * @param {string} key - the api key
     * @param {string} [secret] - the api secret
     * @param {StreamChatOptions} [options] - additional options, here you can pass custom options to axios instance
     * @param {boolean} [options.browser] - enforce the client to be in browser mode
     * @param {boolean} [options.warmUp] - default to false, if true, client will open a connection as soon as possible to speed up following requests
     * @param {Logger} [options.Logger] - custom logger
     * @param {number} [options.timeout] - default to 3000
     * @param {httpsAgent} [options.httpsAgent] - custom httpsAgent, in node it's default to https.agent()
     * @example <caption>initialize the client in user mode</caption>
     * new StreamChat('api_key')
     * @example <caption>initialize the client in user mode with options</caption>
     * new StreamChat('api_key', { warmUp:true, timeout:5000 })
     * @example <caption>secret is optional and only used in server side mode</caption>
     * new StreamChat('api_key', "secret", { httpsAgent: customAgent })
     */
    constructor(key: string, options?: StreamChatOptions);
    constructor(key: string, secret?: string, options?: StreamChatOptions);
    /**
     * Get a client instance
     *
     * This function always returns the same Client instance to avoid issues raised by multiple Client and WS connections
     *
     * **After the first call, the client configuration will not change if the key or options parameters change**
     *
     * @param {string} key - the api key
     * @param {string} [secret] - the api secret
     * @param {StreamChatOptions} [options] - additional options, here you can pass custom options to axios instance
     * @param {boolean} [options.browser] - enforce the client to be in browser mode
     * @param {boolean} [options.warmUp] - default to false, if true, client will open a connection as soon as possible to speed up following requests
     * @param {Logger} [options.Logger] - custom logger
     * @param {number} [options.timeout] - default to 3000
     * @param {httpsAgent} [options.httpsAgent] - custom httpsAgent, in node it's default to https.agent()
     * @example <caption>initialize the client in user mode</caption>
     * StreamChat.getInstance('api_key')
     * @example <caption>initialize the client in user mode with options</caption>
     * StreamChat.getInstance('api_key', { timeout:5000 })
     * @example <caption>secret is optional and only used in server side mode</caption>
     * StreamChat.getInstance('api_key', "secret", { httpsAgent: customAgent })
     */
    static getInstance<AttachmentType extends UR = UR, ChannelType extends UR = UR, CommandType extends string = LiteralStringForUnion, EventType extends UR = UR, MessageType extends UR = UR, ReactionType extends UR = UR, UserType extends UR = UR>(key: string, options?: StreamChatOptions): StreamChat<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    static getInstance<AttachmentType extends UR = UR, ChannelType extends UR = UR, CommandType extends string = LiteralStringForUnion, EventType extends UR = UR, MessageType extends UR = UR, ReactionType extends UR = UR, UserType extends UR = UR>(key: string, secret?: string, options?: StreamChatOptions): StreamChat<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    devToken(userID: string): string;
    getAuthType(): "anonymous" | "jwt";
    setBaseURL(baseURL: string): void;
    _getConnectionID: () => string | undefined;
    _hasConnectionID: () => boolean;
    /**
     * connectUser - Set the current user and open a WebSocket connection
     *
     * @param {OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>} user Data about this user. IE {name: "john"}
     * @param {TokenOrProvider} userTokenOrProvider Token or provider
     *
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Returns a promise that resolves when the connection is setup
     */
    connectUser: (user: OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>, userTokenOrProvider: TokenOrProvider) => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * @deprecated Please use connectUser() function instead. Its naming is more consistent with its functionality.
     *
     * setUser - Set the current user and open a WebSocket connection
     *
     * @param {OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>} user Data about this user. IE {name: "john"}
     * @param {TokenOrProvider} userTokenOrProvider Token or provider
     *
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Returns a promise that resolves when the connection is setup
     */
    setUser: (user: OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>, userTokenOrProvider: TokenOrProvider) => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    _setToken: (user: UserResponse<UserType>, userTokenOrProvider: TokenOrProvider) => Promise<void>;
    _setUser(user: OwnUserResponse<ChannelType, CommandType, UserType> | UserResponse<UserType>): void;
    /**
     * Disconnects the websocket connection, without removing the user set on client.
     * client.closeConnection will not trigger default auto-retry mechanism for reconnection. You need
     * to call client.openConnection to reconnect to websocket.
     *
     * This is mainly useful on mobile side. You can only receive push notifications
     * if you don't have active websocket connection.
     * So when your app goes to background, you can call `client.closeConnection`.
     * And when app comes back to foreground, call `client.openConnection`.
     *
     * @param timeout Max number of ms, to wait for close event of websocket, before forcefully assuming succesful disconnection.
     *                https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    closeConnection: (timeout?: number | undefined) => Promise<void>;
    /**
     * Creates a new WebSocket connection with the current user. Returns empty promise, if there is an active connection
     */
    openConnection: () => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * @deprecated Please use client.openConnction instead.
     * @private
     *
     * Creates a new websocket connection with current user.
     */
    _setupConnection: () => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
       * updateAppSettings - updates application settings
       *
       * @param {AppSettings} options App settings.
       * 		IE: {
                  "apn_config": {
                      "auth_type": "token",
                      "auth_key": fs.readFileSync(
                          './apn-push-auth-key.p8',
                          'utf-8',
                      ),
                      "key_id": "keyid",
                      "team_id": "teamid", //either ALL these 3
                      "notification_template": "notification handlebars template",
                      "bundle_id": "com.apple.your.app",
                      "development": true
                  },
                  "firebase_config": {
                      "server_key": "server key from fcm",
                      "notification_template": "notification handlebars template"
                      "data_template": "data handlebars template"
                  },
                  "webhook_url": "https://acme.com/my/awesome/webhook/"
              }
       */
    updateAppSettings(options: AppSettings): Promise<APIResponse>;
    _normalizeDate: (before: Date | string | null) => string | null;
    /**
     * Revokes all tokens on application level issued before given time
     */
    revokeTokens(before: Date | string | null): Promise<APIResponse>;
    /**
     * Revokes token for a user issued before given time
     */
    revokeUserToken(userID: string, before?: Date | string | null): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * Revokes tokens for a list of users issued before given time
     */
    revokeUsersToken(userIDs: string[], before?: Date | string | null): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * getAppSettings - retrieves application settings
     */
    getAppSettings(): Promise<AppSettingsAPIResponse<CommandType>>;
    /**
       * testPushSettings - Tests the push settings for a user with a random chat message and the configured push templates
       *
       * @param {string} userID User ID. If user has no devices, it will error
       * @param {TestPushDataInput} [data] Overrides for push templates/message used
       * 		IE: {
                    messageID: 'id-of-message',//will error if message does not exist
                    apnTemplate: '{}', //if app doesn't have apn configured it will error
                    firebaseTemplate: '{}', //if app doesn't have firebase configured it will error
                    firebaseDataTemplate: '{}', //if app doesn't have firebase configured it will error
                    huaweiDataTemplate: '{}' //if app doesn't have huawei configured it will error
                    skipDevices: true, // skip config/device checks and sending to real devices
              }
       */
    testPushSettings(userID: string, data?: TestPushDataInput): Promise<CheckPushResponse>;
    /**
     * testSQSSettings - Tests that the given or configured SQS configuration is valid
     *
     * @param {TestSQSDataInput} [data] Overrides SQS settings for testing if needed
     * 		IE: {
                    sqs_key: 'auth_key',
                    sqs_secret: 'auth_secret',
                    sqs_url: 'url_to_queue',
              }
     */
    testSQSSettings(data?: TestSQSDataInput): Promise<CheckSQSResponse>;
    /**
     * Disconnects the websocket and removes the user from client.
     *
     * @param timeout Max number of ms, to wait for close event of websocket, before forcefully assuming successful disconnection.
     *                https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    disconnectUser: (timeout?: number | undefined) => Promise<void>;
    /**
     *
     * @deprecated Please use client.disconnectUser instead.
     *
     * Disconnects the websocket and removes the user from client.
     */
    disconnect: (timeout?: number | undefined) => Promise<void>;
    /**
     * connectAnonymousUser - Set an anonymous user and open a WebSocket connection
     */
    connectAnonymousUser: () => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * @deprecated Please use connectAnonymousUser. Its naming is more consistent with its functionality.
     */
    setAnonymousUser: () => Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * setGuestUser - Setup a temporary guest user
     *
     * @param {UserResponse<UserType>} user Data about this user. IE {name: "john"}
     *
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Returns a promise that resolves when the connection is setup
     */
    setGuestUser(user: UserResponse<UserType>): Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * createToken - Creates a token to authenticate this user. This function is used server side.
     * The resulting token should be passed to the client side when the users registers or logs in
     *
     * @param {string} userID The User ID
     * @param {number} [exp] The expiration time for the token expressed in the number of seconds since the epoch
     *
     * @return {string} Returns a token
     */
    createToken(userID: string, exp?: number, iat?: number): string;
    /**
     * on - Listen to events on all channels and users your watching
     *
     * client.on('message.new', event => {console.log("my new message", event, channel.state.messages)})
     * or
     * client.on(event => {console.log(event.type)})
     *
     * @param {EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType> | string} callbackOrString  The event type to listen for (optional)
     * @param {EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>} [callbackOrNothing] The callback to call
     *
     * @return {{ unsubscribe: () => void }} Description
     */
    on(callback: EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>): {
        unsubscribe: () => void;
    };
    on(eventType: string, callback: EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>): {
        unsubscribe: () => void;
    };
    /**
     * off - Remove the event handler
     *
     */
    off(callback: EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>): void;
    off(eventType: string, callback: EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>): void;
    _logApiRequest(type: string, url: string, data: unknown, config: AxiosRequestConfig & {
        config?: AxiosRequestConfig & {
            maxBodyLength?: number;
        };
    }): void;
    _logApiResponse<T>(type: string, url: string, response: AxiosResponse<T>): void;
    _logApiError(type: string, url: string, error: unknown): void;
    doAxiosRequest: <T>(type: string, url: string, data?: unknown, options?: AxiosRequestConfig & {
        config?: AxiosRequestConfig & {
            maxBodyLength?: number;
        };
    }) => Promise<T>;
    get<T>(url: string, params?: AxiosRequestConfig['params']): Promise<T>;
    put<T>(url: string, data?: unknown): Promise<T>;
    post<T>(url: string, data?: unknown): Promise<T>;
    patch<T>(url: string, data?: unknown): Promise<T>;
    delete<T>(url: string, params?: AxiosRequestConfig['params']): Promise<T>;
    sendFile(url: string, uri: string | NodeJS.ReadableStream | Buffer | File, name?: string, contentType?: string, user?: UserResponse<UserType>): Promise<SendFileAPIResponse>;
    errorFromResponse<T>(response: AxiosResponse<T & {
        code?: number;
        message?: string;
    }>): Error & {
        code?: number | undefined;
        response?: AxiosResponse<T> | undefined;
        status?: number | undefined;
    };
    handleResponse<T>(response: AxiosResponse<T>): T;
    dispatchEvent: (event: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>) => void;
    handleEvent: (messageEvent: WebSocket.MessageEvent) => void;
    /**
     * Updates the members and watchers of the currently active channels that contain this user
     *
     * @param {UserResponse<UserType>} user
     */
    _updateMemberWatcherReferences: (user: UserResponse<UserType>) => void;
    /**
     * @deprecated Please _updateMemberWatcherReferences instead.
     * @private
     */
    _updateUserReferences: (user: UserResponse<UserType>) => void;
    /**
     * @private
     *
     * Updates the messages from the currently active channels that contain this user,
     * with updated user object.
     *
     * @param {UserResponse<UserType>} user
     */
    _updateUserMessageReferences: (user: UserResponse<UserType>) => void;
    /**
     * @private
     *
     * Deletes the messages from the currently active channels that contain this user
     *
     * If hardDelete is true, all the content of message will be stripped down.
     * Otherwise, only 'message.type' will be set as 'deleted'.
     *
     * @param {UserResponse<UserType>} user
     * @param {boolean} hardDelete
     */
    _deleteUserMessageReference: (user: UserResponse<UserType>, hardDelete?: boolean) => void;
    /**
     * @private
     *
     * Handle following user related events:
     * - user.presence.changed
     * - user.updated
     * - user.deleted
     *
     * @param {Event} event
     */
    _handleUserEvent: (event: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>) => void;
    _handleClientEvent(event: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>): (() => void)[];
    _muteStatus(cid: string): {
        muted: boolean;
        createdAt: Date;
        expiresAt: Date | null;
    } | {
        muted: boolean;
        createdAt: null;
        expiresAt: null;
    };
    _callClientListeners: (event: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>) => void;
    recoverState: () => Promise<void>;
    /**
     * @private
     */
    connect(): Promise<void | import("./types").ConnectionOpen<ChannelType, CommandType, UserType>>;
    /**
     * Check the connectivity with server for warmup purpose.
     *
     * @private
     */
    _sayHi(): void;
    /**
     * queryUsers - Query users and watch user presence
     *
     * @param {UserFilters<UserType>} filterConditions MongoDB style filter conditions
     * @param {UserSort<UserType>} sort Sort options, for instance [{last_active: -1}].
     * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{last_active: -1}, {created_at: 1}]
     * @param {UserOptions} options Option object, {presence: true}
     *
     * @return {Promise<APIResponse & { users: Array<UserResponse<UserType>> }>} User Query Response
     */
    queryUsers(filterConditions: UserFilters<UserType>, sort?: UserSort<UserType>, options?: UserOptions): Promise<APIResponse & {
        users: Array<UserResponse<UserType>>;
    }>;
    /**
     * queryBannedUsers - Query user bans
     *
     * @param {BannedUsersFilters} filterConditions MongoDB style filter conditions
     * @param {BannedUsersSort} sort Sort options [{created_at: 1}].
     * @param {BannedUsersPaginationOptions} options Option object, {limit: 10, offset:0}
     *
     * @return {Promise<BannedUsersResponse<ChannelType, CommandType, UserType>>} Ban Query Response
     */
    queryBannedUsers(filterConditions?: BannedUsersFilters, sort?: BannedUsersSort, options?: BannedUsersPaginationOptions): Promise<BannedUsersResponse<ChannelType, CommandType, UserType>>;
    /**
     * queryMessageFlags - Query message flags
     *
     * @param {MessageFlagsFilters} filterConditions MongoDB style filter conditions
     * @param {MessageFlagsPaginationOptions} options Option object, {limit: 10, offset:0}
     *
     * @return {Promise<MessageFlagsResponse<ChannelType, CommandType, UserType>>} Message Flags Response
     */
    queryMessageFlags(filterConditions?: MessageFlagsFilters, options?: MessageFlagsPaginationOptions): Promise<MessageFlagsResponse<ChannelType, CommandType, UserType, UR, UR, UR>>;
    /**
     * queryChannels - Query channels
     *
     * @param {ChannelFilters<ChannelType, CommandType, UserType>} filterConditions object MongoDB style filters
     * @param {ChannelSort<ChannelType>} [sort] Sort options, for instance {created_at: -1}.
     * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{last_updated: -1}, {created_at: 1}]
     * @param {ChannelOptions} [options] Options object
     *
     * @return {Promise<APIResponse & { channels: Array<ChannelAPIResponse<AttachmentType,ChannelType,CommandType,MessageType,ReactionType,UserType>>}> } search channels response
     */
    queryChannels(filterConditions: ChannelFilters<ChannelType, CommandType, UserType>, sort?: ChannelSort<ChannelType>, options?: ChannelOptions): Promise<Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>[]>;
    filterMessagesAfterTime: (message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>, createdAfter: number) => boolean;
    /**
     * search - Query messages
     *
     * @param {ChannelFilters<ChannelType, CommandType, UserType>} filterConditions MongoDB style filter conditions
     * @param {MessageFilters<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> | string} query search query or object MongoDB style filters
     * @param {SearchOptions<MessageType>} [options] Option object, {user_id: 'tommaso'}
     *
     * @return {Promise<SearchAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} search messages response
     */
    search(filterConditions: ChannelFilters<ChannelType, CommandType, UserType>, query: string | MessageFilters<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>, options?: SearchOptions<MessageType>): Promise<SearchAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>;
    /**
     * setLocalDevice - Set the device info for the current client(device) that will be sent via WS connection automatically
     *
     * @param {BaseDeviceFields} device the device object
     * @param {string} device.id device id
     * @param {string} device.push_provider the push provider
     *
     */
    setLocalDevice(device: BaseDeviceFields): void;
    /**
     * addDevice - Adds a push device for a user.
     *
     * @param {string} id the device id
     * @param {PushProvider} push_provider the push provider
     * @param {string} [userID] the user id (defaults to current user)
     *
     */
    addDevice(id: string, push_provider: PushProvider, userID?: string): Promise<APIResponse>;
    /**
     * getDevices - Returns the devices associated with a current user
     *
     * @param {string} [userID] User ID. Only works on serverside
     *
     * @return {APIResponse & Device<UserType>[]} Array of devices
     */
    getDevices(userID?: string): Promise<APIResponse & {
        devices?: Device<UserType>[] | undefined;
    }>;
    /**
     * removeDevice - Removes the device with the given id. Clientside users can only delete their own devices
     *
     * @param {string} id The device id
     * @param {string} [userID] The user id. Only specify this for serverside requests
     *
     */
    removeDevice(id: string, userID?: string): Promise<APIResponse>;
    /**
     * getRateLimits - Returns the rate limits quota and usage for the current app, possibly filter for a specific platform and/or endpoints.
     * Only available server-side.
     *
     * @param {object} [params] The params for the call. If none of the params are set, all limits for all platforms are returned.
     * @returns {Promise<GetRateLimitsResponse>}
     */
    getRateLimits(params?: {
        android?: boolean;
        endpoints?: EndpointName[];
        ios?: boolean;
        serverSide?: boolean;
        web?: boolean;
    }): Promise<GetRateLimitsResponse>;
    _addChannelConfig(channelState: ChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>): void;
    /**
     * channel - Returns a new channel with the given type, id and custom data
     *
     * If you want to create a unique conversation between 2 or more users; you can leave out the ID parameter and provide the list of members.
     * Make sure to await channel.create() or channel.watch() before accessing channel functions:
     * ie. channel = client.channel("messaging", {members: ["tommaso", "thierry"]})
     * await channel.create() to assign an ID to channel
     *
     * @param {string} channelType The channel type
     * @param {string | ChannelData<ChannelType> | null} [channelIDOrCustom]   The channel ID, you can leave this out if you want to create a conversation channel
     * @param {object} [custom]    Custom data to attach to the channel
     *
     * @return {channel} The channel object, initialize it using channel.watch()
     */
    channel(channelType: string, channelID?: string | null, custom?: ChannelData<ChannelType>): Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    channel(channelType: string, custom?: ChannelData<ChannelType>): Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    /**
     * It's a helper method for `client.channel()` method, used to create unique conversation or
     * channel based on member list instead of id.
     *
     * If the channel already exists in `activeChannels` list, then we simply return it, since that
     * means the same channel was already requested or created.
     *
     * Otherwise we create a new instance of Channel class and return it.
     *
     * @private
     *
     * @param {string} channelType The channel type
     * @param {object} [custom]    Custom data to attach to the channel
     *
     * @return {channel} The channel object, initialize it using channel.watch()
     */
    getChannelByMembers: (channelType: string, custom: ChannelData<ChannelType>) => Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    /**
     * Its a helper method for `client.channel()` method, used to channel given the id of channel.
     *
     * If the channel already exists in `activeChannels` list, then we simply return it, since that
     * means the same channel was already requested or created.
     *
     * Otherwise we create a new instance of Channel class and return it.
     *
     * @private
     *
     * @param {string} channelType The channel type
     * @param {string} [channelID] The channel ID
     * @param {object} [custom]    Custom data to attach to the channel
     *
     * @return {channel} The channel object, initialize it using channel.watch()
     */
    getChannelById: (channelType: string, channelID: string, custom: ChannelData<ChannelType>) => Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>;
    /**
     * partialUpdateUser - Update the given user object
     *
     * @param {PartialUserUpdate<UserType>} partialUserObject which should contain id and any of "set" or "unset" params;
     * example: {id: "user1", set:{field: value}, unset:["field2"]}
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>} list of updated users
     */
    partialUpdateUser(partialUserObject: PartialUserUpdate<UserType>): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * upsertUsers - Batch upsert the list of users
     *
     * @param {UserResponse<UserType>[]} users list of users
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    upsertUsers(users: UserResponse<UserType>[]): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * @deprecated Please use upsertUsers() function instead.
     *
     * updateUsers - Batch update the list of users
     *
     * @param {UserResponse<UserType>[]} users list of users
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    updateUsers: (users: UserResponse<UserType>[]) => Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * upsertUser - Update or Create the given user object
     *
     * @param {UserResponse<UserType>} userObject user object, the only required field is the user id. IE {id: "myuser"} is valid
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    upsertUser(userObject: UserResponse<UserType>): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * @deprecated Please use upsertUser() function instead.
     *
     * updateUser - Update or Create the given user object
     *
     * @param {UserResponse<UserType>} userObject user object, the only required field is the user id. IE {id: "myuser"} is valid
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    updateUser: (userObject: UserResponse<UserType>) => Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    /**
     * partialUpdateUsers - Batch partial update of users
     *
     * @param {PartialUserUpdate<UserType>[]} users list of partial update requests
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    partialUpdateUsers(users: PartialUserUpdate<UserType>[]): Promise<APIResponse & {
        users: {
            [key: string]: UserResponse<UserType>;
        };
    }>;
    deleteUser(userID: string, params?: {
        delete_conversation_channels?: boolean;
        hard_delete?: boolean;
        mark_messages_deleted?: boolean;
    }): Promise<APIResponse & {
        user: UserResponse<UserType>;
    }>;
    reactivateUser(userID: string, options?: {
        created_by_id?: string;
        name?: string;
        restore_messages?: boolean;
    }): Promise<APIResponse & {
        user: UserResponse<UserType>;
    }>;
    deactivateUser(userID: string, options?: {
        created_by_id?: string;
        mark_messages_deleted?: boolean;
    }): Promise<APIResponse & {
        user: UserResponse<UserType>;
    }>;
    exportUser(userID: string, options?: Record<string, string>): Promise<APIResponse & {
        messages: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>[];
        reactions: ReactionResponse<ReactionType, UserType>[];
        user: UserResponse<UserType>;
    }>;
    /** banUser - bans a user from all channels
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} [options]
     * @returns {Promise<APIResponse>}
     */
    banUser(targetUserID: string, options?: BanUserOptions<UserType>): Promise<APIResponse>;
    /** unbanUser - revoke global ban for a user
     *
     * @param {string} targetUserID
     * @param {UnBanUserOptions} [options]
     * @returns {Promise<APIResponse>}
     */
    unbanUser(targetUserID: string, options?: UnBanUserOptions): Promise<APIResponse>;
    /** shadowBan - shadow bans a user from all channels
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} [options]
     * @returns {Promise<APIResponse>}
     */
    shadowBan(targetUserID: string, options?: BanUserOptions<UserType>): Promise<APIResponse>;
    /** removeShadowBan - revoke global shadow ban for a user
     *
     * @param {string} targetUserID
     * @param {UnBanUserOptions} [options]
     * @returns {Promise<APIResponse>}
     */
    removeShadowBan(targetUserID: string, options?: UnBanUserOptions): Promise<APIResponse>;
    /** muteUser - mutes a user
     *
     * @param {string} targetID
     * @param {string} [userID] Only used with serverside auth
     * @param {MuteUserOptions<UserType>} [options]
     * @returns {Promise<MuteUserResponse<ChannelType, CommandType, UserType>>}
     */
    muteUser(targetID: string, userID?: string, options?: MuteUserOptions<UserType>): Promise<MuteUserResponse<ChannelType, CommandType, UserType>>;
    /** unmuteUser - unmutes a user
     *
     * @param {string} targetID
     * @param {string} [currentUserID] Only used with serverside auth
     * @returns {Promise<APIResponse>}
     */
    unmuteUser(targetID: string, currentUserID?: string): Promise<APIResponse>;
    /** userMuteStatus - check if a user is muted or not, can be used after connectUser() is called
     *
     * @param {string} targetID
     * @returns {boolean}
     */
    userMuteStatus(targetID: string): boolean;
    /**
     * flagMessage - flag a message
     * @param {string} targetMessageID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */
    flagMessage(targetMessageID: string, options?: {
        user_id?: string;
    }): Promise<FlagMessageResponse<UserType>>;
    /**
     * flagUser - flag a user
     * @param {string} targetID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */
    flagUser(targetID: string, options?: {
        user_id?: string;
    }): Promise<FlagUserResponse<UserType>>;
    /**
     * unflagMessage - unflag a message
     * @param {string} targetMessageID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */
    unflagMessage(targetMessageID: string, options?: {
        user_id?: string;
    }): Promise<FlagMessageResponse<UserType>>;
    /**
     * unflagUser - unflag a user
     * @param {string} targetID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */
    unflagUser(targetID: string, options?: {
        user_id?: string;
    }): Promise<FlagUserResponse<UserType>>;
    /**
     * @deprecated use markChannelsRead instead
     *
     * markAllRead - marks all channels for this user as read
     * @param {MarkAllReadOptions<UserType>} [data]
     *
     * @return {Promise<APIResponse>}
     */
    markAllRead: (data?: MarkChannelsReadOptions<UserType>) => Promise<void>;
    /**
     * markChannelsRead - marks channels read -
     * it accepts a map of cid:messageid pairs, if messageid is empty, the whole channel will be marked as read
     *
     * @param {MarkChannelsReadOptions <UserType>} [data]
     *
     * @return {Promise<APIResponse>}
     */
    markChannelsRead(data?: MarkChannelsReadOptions<UserType>): Promise<void>;
    createCommand(data: CreateCommandOptions<CommandType>): Promise<CreateCommandResponse<CommandType>>;
    getCommand(name: string): Promise<GetCommandResponse<CommandType>>;
    updateCommand(name: string, data: UpdateCommandOptions<CommandType>): Promise<UpdateCommandResponse<CommandType>>;
    deleteCommand(name: string): Promise<DeleteCommandResponse<CommandType>>;
    listCommands(): Promise<ListCommandsResponse<CommandType>>;
    createChannelType(data: CreateChannelOptions<CommandType>): Promise<CreateChannelResponse<CommandType>>;
    getChannelType(channelType: string): Promise<GetChannelTypeResponse<CommandType>>;
    updateChannelType(channelType: string, data: UpdateChannelOptions<CommandType>): Promise<UpdateChannelResponse<CommandType>>;
    deleteChannelType(channelType: string): Promise<APIResponse>;
    listChannelTypes(): Promise<ListChannelResponse<CommandType>>;
    /**
     * translateMessage - adds the translation to the message
     *
     * @param {string} messageId
     * @param {string} language
     *
     * @return {APIResponse & MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} Response that includes the message
     */
    translateMessage(messageId: string, language: string): Promise<APIResponse & MessageType & {
        id: string;
        attachments?: import("./types").Attachment<AttachmentType>[] | undefined;
        html?: string | undefined;
        mml?: string | undefined;
        parent_id?: string | undefined;
        pinned?: boolean | undefined;
        quoted_message_id?: string | undefined;
        show_in_channel?: boolean | undefined;
        text?: string | undefined;
        user?: UserResponse<UserType> | null | undefined;
        user_id?: string | undefined;
    } & {
        args?: string | undefined;
        channel?: import("./types").ChannelResponse<ChannelType, CommandType, UserType> | undefined;
        cid?: string | undefined;
        command?: string | undefined;
        command_info?: {
            name?: string | undefined;
        } | undefined;
        created_at?: string | undefined;
        deleted_at?: string | undefined;
        i18n?: (import("./types").RequireAtLeastOne<Record<"_text" | "so_text" | "hr_text" | "th_text" | "tr_text" | "no_text" | "af_text" | "am_text" | "ar_text" | "az_text" | "bg_text" | "bn_text" | "bs_text" | "cs_text" | "da_text" | "de_text" | "el_text" | "en_text" | "es_text" | "es-MX_text" | "et_text" | "fa_text" | "fa-AF_text" | "fi_text" | "fr_text" | "fr-CA_text" | "ha_text" | "he_text" | "hi_text" | "hu_text" | "id_text" | "it_text" | "ja_text" | "ka_text" | "ko_text" | "lv_text" | "ms_text" | "nl_text" | "pl_text" | "ps_text" | "pt_text" | "ro_text" | "ru_text" | "sk_text" | "sl_text" | "sq_text" | "sr_text" | "sv_text" | "sw_text" | "ta_text" | "tl_text" | "uk_text" | "ur_text" | "vi_text" | "zh_text" | "zh-TW_text", string>> & {
            language: import("./types").TranslationLanguages;
        }) | undefined;
        latest_reactions?: ReactionResponse<ReactionType, UserType>[] | undefined;
        mentioned_users?: UserResponse<UserType>[] | undefined;
        own_reactions?: ReactionResponse<ReactionType, UserType>[] | null | undefined;
        pin_expires?: string | null | undefined;
        pinned_at?: string | null | undefined;
        pinned_by?: UserResponse<UserType> | null | undefined;
        reaction_counts?: {
            [key: string]: number;
        } | null | undefined;
        reaction_scores?: {
            [key: string]: number;
        } | null | undefined;
        reply_count?: number | undefined;
        shadowed?: boolean | undefined;
        silent?: boolean | undefined;
        status?: string | undefined;
        thread_participants?: UserResponse<UserType>[] | undefined;
        type?: import("./types").MessageLabel | undefined;
        updated_at?: string | undefined;
    } & {
        quoted_message?: import("./types").MessageResponseBase<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> | undefined;
    }>;
    /**
     * _normalizeExpiration - transforms expiration value into ISO string
     * @param {undefined|null|number|string|Date} timeoutOrExpirationDate expiration date or timeout. Use number type to set timeout in seconds, string or Date to set exact expiration date
     */
    _normalizeExpiration(timeoutOrExpirationDate?: null | number | string | Date): string | undefined;
    /**
     * _messageId - extracts string message id from either message object or message id
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {string} errorText error message to report in case of message id absence
     */
    _validateAndGetMessageId(messageOrMessageId: string | {
        id: string;
    }, errorText: string): string;
    /**
     * pinMessage - pins the message
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {undefined|null|number|string|Date} timeoutOrExpirationDate expiration date or timeout. Use number type to set timeout in seconds, string or Date to set exact expiration date
     * @param {string | { id: string }} [userId]
     */
    pinMessage(messageOrMessageId: string | {
        id: string;
    }, timeoutOrExpirationDate?: null | number | string | Date, userId?: string | {
        id: string;
    }): Promise<UpdateMessageAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>;
    /**
     * unpinMessage - unpins the message that was previously pinned
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {string | { id: string }} [userId]
     */
    unpinMessage(messageOrMessageId: string | {
        id: string;
    }, userId?: string | {
        id: string;
    }): Promise<UpdateMessageAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>;
    /**
     * updateMessage - Update the given message
     *
     * @param {Omit<MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>, 'mentioned_users'> & { mentioned_users?: string[] }} message object, id needs to be specified
     * @param {string | { id: string }} [userId]
     * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
     *
     * @return {APIResponse & { message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> }} Response that includes the message
     */
    updateMessage(message: UpdatedMessage<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>, userId?: string | {
        id: string;
    }, options?: {
        skip_enrich_url?: boolean;
    }): Promise<UpdateMessageAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>;
    /**
     * partialUpdateMessage - Update the given message id while retaining additional properties
     *
     * @param {string} id the message id
     *
     * @param {PartialUpdateMessage<MessageType>}  partialMessageObject which should contain id and any of "set" or "unset" params;
     *         example: {id: "user1", set:{text: "hi"}, unset:["color"]}
     * @param {string | { id: string }} [userId]
     *
     * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
     *
     * @return {APIResponse & { message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> }} Response that includes the updated message
     */
    partialUpdateMessage(id: string, partialMessageObject: PartialMessageUpdate<MessageType>, userId?: string | {
        id: string;
    }, options?: {
        skip_enrich_url?: boolean;
    }): Promise<UpdateMessageAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>;
    deleteMessage(messageID: string, hardDelete?: boolean): Promise<APIResponse & {
        message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>;
    }>;
    getMessage(messageID: string): Promise<APIResponse & {
        message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>;
    }>;
    getUserAgent(): string;
    setUserAgent(userAgent: string): void;
    /**
     * _isUsingServerAuth - Returns true if we're using server side auth
     */
    _isUsingServerAuth: () => boolean;
    _enrichAxiosOptions(options?: AxiosRequestConfig & {
        config?: AxiosRequestConfig;
    }): AxiosRequestConfig;
    _getToken(): string | null | undefined;
    _startCleaning(): void;
    /**
     * encode ws url payload
     * @private
     * @returns json string
     */
    _buildWSPayload: (client_request_id?: string | undefined) => string;
    verifyWebhook(requestBody: string, xSignature: string): boolean;
    /** getPermission - gets the definition for a permission
     *
     * @param {string} name
     * @returns {Promise<PermissionAPIResponse>}
     */
    getPermission(name: string): Promise<PermissionAPIResponse>;
    /** createPermission - creates a custom permission
     *
     * @param {CustomPermissionOptions} permissionData the permission data
     * @returns {Promise<APIResponse>}
     */
    createPermission(permissionData: CustomPermissionOptions): Promise<APIResponse>;
    /** updatePermission - updates an existing custom permission
     *
     * @param {string} id
     * @param {Omit<CustomPermissionOptions, 'id'>} permissionData the permission data
     * @returns {Promise<APIResponse>}
     */
    updatePermission(id: string, permissionData: Omit<CustomPermissionOptions, 'id'>): Promise<APIResponse>;
    /** deletePermission - deletes a custom permission
     *
     * @param {string} name
     * @returns {Promise<APIResponse>}
     */
    deletePermission(name: string): Promise<APIResponse>;
    /** listPermissions - returns the list of all permissions for this application
     *
     * @returns {Promise<APIResponse>}
     */
    listPermissions(): Promise<PermissionsAPIResponse>;
    /** createRole - creates a custom role
     *
     * @param {string} name the new role name
     * @returns {Promise<APIResponse>}
     */
    createRole(name: string): Promise<APIResponse>;
    /** listRoles - returns the list of all roles for this application
     *
     * @returns {Promise<APIResponse>}
     */
    listRoles(): Promise<APIResponse>;
    /** deleteRole - deletes a custom role
     *
     * @param {string} name the role name
     * @returns {Promise<APIResponse>}
     */
    deleteRole(name: string): Promise<APIResponse>;
    /** sync - returns all events that happened for a list of channels since last sync
     * @param {string[]} channel_cids list of channel CIDs
     * @param {string} last_sync_at last time the user was online and in sync. RFC3339 ie. "2020-05-06T15:05:01.207Z"
     */
    sync(channel_cids: string[], last_sync_at: string): Promise<APIResponse & {
        events: Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>[];
    }>;
    /**
     * sendUserCustomEvent - Send a custom event to a user
     *
     * @param {string} targetUserID target user id
     * @param {UserCustomEvent} event for example {type: 'friendship-request'}
     *
     * @return {Promise<APIResponse>} The Server Response
     */
    sendUserCustomEvent(targetUserID: string, event: UserCustomEvent): Promise<APIResponse>;
    createBlockList(blockList: BlockList): Promise<APIResponse>;
    listBlockLists(): Promise<APIResponse & {
        blocklists: BlockListResponse[];
    }>;
    getBlockList(name: string): Promise<APIResponse & {
        blocklist: BlockListResponse;
    }>;
    updateBlockList(name: string, data: {
        words: string[];
    }): Promise<APIResponse>;
    deleteBlockList(name: string): Promise<APIResponse>;
    exportChannels(request: Array<ExportChannelRequest>, options?: ExportChannelOptions): Promise<APIResponse & ExportChannelResponse>;
    exportChannel(request: ExportChannelRequest, options?: ExportChannelOptions): Promise<APIResponse & ExportChannelResponse>;
    getExportChannelStatus(id: string): Promise<APIResponse & ExportChannelStatusResponse>;
    /**
     * createSegment - Creates a Campaign Segment
     *
     * @param {SegmentData} params Segment data
     *
     * @return {Segment} The Created Segment
     */
    createSegment(params: SegmentData): Promise<Segment>;
    /**
     * getSegment - Get a Campaign Segment
     *
     * @param {string} id Segment ID
     *
     * @return {Segment} A Segment
     */
    getSegment(id: string): Promise<Segment>;
    /**
     * listSegments - List Campaign Segments
     *
     *
     * @return {Segment[]} Segments
     */
    listSegments(options: {
        limit?: number;
        offset?: number;
    }): Promise<Segment[]>;
    /**
     * updateSegment - Update a Campaign Segment
     *
     * @param {string} id Segment ID
     * @param {Partial<SegmentData>} params Segment data
     *
     * @return {Segment} Updated Segment
     */
    updateSegment(id: string, params: Partial<SegmentData>): Promise<Segment>;
    /**
     * deleteSegment - Delete a Campaign Segment
     *
     * @param {string} id Segment ID
     *
     * @return {Promise<APIResponse>} The Server Response
     */
    deleteSegment(id: string): Promise<APIResponse>;
    /**
     * createCampaign - Creates a Campaign
     *
     * @param {CampaignData} params Campaign data
     *
     * @return {Campaign} The Created Campaign
     */
    createCampaign(params: CampaignData): Promise<Campaign>;
    /**
     * getCampaign - Get a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} A Campaign
     */
    getCampaign(id: string): Promise<Campaign>;
    /**
     * listCampaigns - List Campaigns
     *
     *
     * @return {Campaign[]} Campaigns
     */
    listCampaigns(options: {
        limit?: number;
        offset?: number;
    }): Promise<Campaign[]>;
    /**
     * updateCampaign - Update a Campaign
     *
     * @param {string} id Campaign ID
     * @param {Partial<CampaignData>} params Campaign data
     *
     * @return {Campaign} Updated Campaign
     */
    updateCampaign(id: string, params: Partial<CampaignData>): Promise<Campaign>;
    /**
     * deleteCampaign - Delete a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Promise<APIResponse>} The Server Response
     */
    deleteCampaign(id: string): Promise<APIResponse>;
    /**
     * scheduleCampaign - Schedule a Campaign
     *
     * @param {string} id Campaign ID
     * @param {{sendAt: number}} params Schedule params
     *
     * @return {Campaign} Scheduled Campaign
     */
    scheduleCampaign(id: string, params: {
        sendAt: number;
    }): Promise<Campaign>;
    /**
     * stopCampaign - Stop a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} Stopped Campaign
     */
    stopCampaign(id: string): Promise<Campaign>;
    /**
     * resumeCampaign - Resume a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} Resumed Campaign
     */
    resumeCampaign(id: string): Promise<Campaign>;
    /**
     * testCampaign - Test a Campaign
     *
     * @param {string} id Campaign ID
     * @param {{users: string[]}} params Test params
     * @return {Campaign} Test Campaign
     */
    testCampaign(id: string, params: {
        users: string[];
    }): Promise<Campaign>;
    /**
     * enrichURL - Get OpenGraph data of the given link
     *
     * @param {string} url link
     * @return {OGAttachment} OG Attachment
     */
    enrichURL(url: string): Promise<APIResponse & OGAttachment>;
    /**
     * getTask - Gets status of a long running task
     *
     * @param {string} id Task ID
     *
     * @return {TaskStatus} The task status
     */
    getTask(id: string): Promise<APIResponse & TaskStatus>;
    /**
     * deleteChannels - Deletes a list of channel
     *
     * @param {string[]} cids Channel CIDs
     * @param {boolean} [options.hard_delete] Defines if the channel is hard deleted or not
     *
     * @return {DeleteChannelsResponse} Result of the soft deletion, if server-side, it holds the task ID as well
     */
    deleteChannels(cids: string[], options?: {
        hard_delete?: boolean;
    }): Promise<APIResponse & {
        result: Record<string, string>;
    } & Partial<TaskResponse>>;
    /**
     * deleteUsers - Batch Delete Users
     *
     * @param {string[]} user_ids which users to delete
     * @param {DeleteUserOptions} options Configuration how to delete users
     *
     * @return {APIResponse} A task ID
     */
    deleteUsers(user_ids: string[], options: DeleteUserOptions): Promise<APIResponse & TaskResponse>;
}
//# sourceMappingURL=client.d.ts.map