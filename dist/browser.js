'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base64Js = require('base64-js');
var _extends = require('@babel/runtime/helpers/extends');
var _typeof = require('@babel/runtime/helpers/typeof');
var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var axios = require('axios');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var FormData = require('form-data');
var WebSocket = require('isomorphic-ws');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _objectWithoutProperties__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutProperties);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var FormData__default = /*#__PURE__*/_interopDefaultLegacy(FormData);
var WebSocket__default = /*#__PURE__*/_interopDefaultLegacy(WebSocket);

function isString$1(arrayOrString) {
  return typeof arrayOrString === 'string';
}

function isMapStringCallback(arrayOrString, callback) {
  return !!callback && isString$1(arrayOrString);
} // source - https://github.com/beatgammit/base64-js/blob/master/test/convert.js#L72


function map(arrayOrString, callback) {
  var res = [];

  if (isString$1(arrayOrString) && isMapStringCallback(arrayOrString, callback)) {
    for (var k = 0, len = arrayOrString.length; k < len; k++) {
      if (arrayOrString.charAt(k)) {
        var kValue = arrayOrString.charAt(k);
        var mappedValue = callback(kValue, k, arrayOrString);
        res[k] = mappedValue;
      }
    }
  } else if (!isString$1(arrayOrString) && !isMapStringCallback(arrayOrString, callback)) {
    for (var _k = 0, _len = arrayOrString.length; _k < _len; _k++) {
      if (_k in arrayOrString) {
        var _kValue = arrayOrString[_k];

        var _mappedValue = callback(_kValue, _k, arrayOrString);

        res[_k] = _mappedValue;
      }
    }
  }

  return res;
}

var encodeBase64 = function encodeBase64(data) {
  return base64Js.fromByteArray(new Uint8Array(map(data, function (char) {
    return char.charCodeAt(0);
  })));
}; // base-64 decoder throws exception if encoded string is not padded by '=' to make string length
// in multiples of 4. So gonna use our own method for this purpose to keep backwards compatibility
// https://github.com/beatgammit/base64-js/blob/master/index.js#L26

var decodeBase64 = function decodeBase64(s) {
  var e = {},
      w = String.fromCharCode,
      L = s.length;
  var i,
      b = 0,
      c,
      x,
      l = 0,
      a,
      r = '';
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (i = 0; i < 64; i++) {
    e[A.charAt(i)] = i;
  }

  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)];
    b = (b << 6) + c;
    l += 6;

    while (l >= 8) {
      ((a = b >>> (l -= 8) & 0xff) || x < L - 2) && (r += w(a));
    }
  }

  return r;
};

var https = null;

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * ChannelState - A container class for the channel state.
 */
var ChannelState = /*#__PURE__*/function () {
  /**
   * Flag which indicates if channel state contain latest/recent messages or no.
   * This flag should be managed by UI sdks using a setter - setIsUpToDate.
   * When false, any new message (received by websocket event - message.new) will not
   * be pushed on to message list.
   */
  function ChannelState(channel) {
    var _this = this,
        _channel$state;

    _classCallCheck__default['default'](this, ChannelState);

    _defineProperty__default['default'](this, "_channel", void 0);

    _defineProperty__default['default'](this, "watcher_count", void 0);

    _defineProperty__default['default'](this, "typing", void 0);

    _defineProperty__default['default'](this, "read", void 0);

    _defineProperty__default['default'](this, "messages", void 0);

    _defineProperty__default['default'](this, "pinnedMessages", void 0);

    _defineProperty__default['default'](this, "threads", void 0);

    _defineProperty__default['default'](this, "mutedUsers", void 0);

    _defineProperty__default['default'](this, "watchers", void 0);

    _defineProperty__default['default'](this, "members", void 0);

    _defineProperty__default['default'](this, "unreadCount", void 0);

    _defineProperty__default['default'](this, "membership", void 0);

    _defineProperty__default['default'](this, "last_message_at", void 0);

    _defineProperty__default['default'](this, "isUpToDate", void 0);

    _defineProperty__default['default'](this, "setIsUpToDate", function (isUpToDate) {
      _this.isUpToDate = isUpToDate;
    });

    _defineProperty__default['default'](this, "removeMessageFromArray", function (msgArray, msg) {
      var result = msgArray.filter(function (message) {
        return !(!!message.id && !!msg.id && message.id === msg.id);
      });
      return {
        removed: result.length < msgArray.length,
        result: result
      };
    });

    _defineProperty__default['default'](this, "updateUserMessages", function (user) {
      var _updateUserMessages = function _updateUserMessages(messages, user) {
        for (var i = 0; i < messages.length; i++) {
          var _m$user;

          var m = messages[i];

          if (((_m$user = m.user) === null || _m$user === void 0 ? void 0 : _m$user.id) === user.id) {
            messages[i] = _objectSpread$7(_objectSpread$7({}, m), {}, {
              user: user
            });
          }
        }
      };

      _updateUserMessages(_this.messages, user);

      for (var parentId in _this.threads) {
        _updateUserMessages(_this.threads[parentId], user);
      }

      _updateUserMessages(_this.pinnedMessages, user);
    });

    _defineProperty__default['default'](this, "deleteUserMessages", function (user) {
      var hardDelete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _deleteUserMessages = function _deleteUserMessages(messages, user) {
        var hardDelete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        for (var i = 0; i < messages.length; i++) {
          var _m$user2;

          var m = messages[i];

          if (((_m$user2 = m.user) === null || _m$user2 === void 0 ? void 0 : _m$user2.id) !== user.id) {
            continue;
          }

          if (hardDelete) {
            /**
             * In case of hard delete, we need to strip down all text, html,
             * attachments and all the custom properties on message
             */
            messages[i] = {
              cid: m.cid,
              created_at: m.created_at,
              deleted_at: user.deleted_at,
              id: m.id,
              latest_reactions: [],
              mentioned_users: [],
              own_reactions: [],
              parent_id: m.parent_id,
              reply_count: m.reply_count,
              status: m.status,
              thread_participants: m.thread_participants,
              type: 'deleted',
              updated_at: m.updated_at,
              user: m.user
            };
          } else {
            messages[i] = _objectSpread$7(_objectSpread$7({}, m), {}, {
              type: 'deleted',
              deleted_at: user.deleted_at
            });
          }
        }
      };

      _deleteUserMessages(_this.messages, user, hardDelete);

      for (var parentId in _this.threads) {
        _deleteUserMessages(_this.threads[parentId], user, hardDelete);
      }

      _deleteUserMessages(_this.pinnedMessages, user, hardDelete);
    });

    this._channel = channel;
    this.watcher_count = 0;
    this.typing = {};
    this.read = {};
    this.messages = [];
    this.pinnedMessages = [];
    this.threads = {}; // a list of users to hide messages from

    this.mutedUsers = [];
    this.watchers = {};
    this.members = {};
    this.membership = {};
    this.unreadCount = 0;
    /**
     * Flag which indicates if channel state contain latest/recent messages or no.
     * This flag should be managed by UI sdks using a setter - setIsUpToDate.
     * When false, any new message (received by websocket event - message.new) will not
     * be pushed on to message list.
     */

    this.isUpToDate = true;
    this.last_message_at = (channel === null || channel === void 0 ? void 0 : (_channel$state = channel.state) === null || _channel$state === void 0 ? void 0 : _channel$state.last_message_at) != null ? new Date(channel.state.last_message_at) : null;
  }
  /**
   * addMessageSorted - Add a message to the state
   *
   * @param {MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} newMessage A new message
   * @param {boolean} timestampChanged Whether updating a message with changed created_at value.
   * @param {boolean} addIfDoesNotExist Add message if it is not in the list, used to prevent out of order updated messages from being added.
   *
   */


  _createClass__default['default'](ChannelState, [{
    key: "addMessageSorted",
    value: function addMessageSorted(newMessage) {
      var timestampChanged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var addIfDoesNotExist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return this.addMessagesSorted([newMessage], timestampChanged, false, addIfDoesNotExist);
    }
    /**
     * formatMessage - Takes the message object. Parses the dates, sets __html
     * and sets the status to received if missing. Returns a message object
     *
     * @param {MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} message a message object
     *
     */

  }, {
    key: "formatMessage",
    value: function formatMessage(message) {
      return _objectSpread$7(_objectSpread$7({}, message), {}, {
        /**
         * @deprecated please use `html`
         */
        __html: message.html,
        // parse the date..
        pinned_at: message.pinned_at ? new Date(message.pinned_at) : null,
        created_at: message.created_at ? new Date(message.created_at) : new Date(),
        updated_at: message.updated_at ? new Date(message.updated_at) : new Date(),
        status: message.status || 'received'
      });
    }
    /**
     * addMessagesSorted - Add the list of messages to state and resorts the messages
     *
     * @param {Array<MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} newMessages A list of messages
     * @param {boolean} timestampChanged Whether updating messages with changed created_at value.
     * @param {boolean} initializing Whether channel is being initialized.
     * @param {boolean} addIfDoesNotExist Add message if it is not in the list, used to prevent out of order updated messages from being added.
     *
     */

  }, {
    key: "addMessagesSorted",
    value: function addMessagesSorted(newMessages) {
      var timestampChanged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var initializing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var addIfDoesNotExist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      for (var i = 0; i < newMessages.length; i += 1) {
        var _this$_channel;

        var message = this.formatMessage(newMessages[i]);

        if (message.user && (_this$_channel = this._channel) !== null && _this$_channel !== void 0 && _this$_channel.cid) {
          /**
           * Store the reference to user for this channel, so that when we have to
           * handle updates to user, we can use the reference map, to determine which
           * channels need to be updated with updated user object.
           */
          this._channel.getClient().state.updateUserReference(message.user, this._channel.cid);
        }

        if (initializing && message.id && this.threads[message.id]) {
          // If we are initializing the state of channel (e.g., in case of connection recovery),
          // then in that case we remove thread related to this message from threads object.
          // This way we can ensure that we don't have any stale data in thread object
          // and consumer can refetch the replies.
          delete this.threads[message.id];
        }

        if (!this.last_message_at) {
          this.last_message_at = new Date(message.created_at.getTime());
        }

        if (message.created_at.getTime() > this.last_message_at.getTime()) {
          this.last_message_at = new Date(message.created_at.getTime());
        } // update or append the messages...


        var parentID = message.parent_id; // add to the main message list

        if (!parentID || message.show_in_channel) {
          this.messages = this._addToMessageList(this.messages, message, timestampChanged, 'created_at', addIfDoesNotExist);
        }
        /**
         * Add message to thread if applicable and the message
         * was added when querying for replies, or the thread already exits.
         * This is to prevent the thread state from getting out of sync if
         * a thread message is shown in channel but older than the newest thread
         * message. This situation can result in a thread state where a random
         * message is "oldest" message, and newer messages are therefore not loaded.
         * This can also occur if an old thread message is updated.
         */


        if (parentID && !initializing) {
          var thread = this.threads[parentID] || [];

          var threadMessages = this._addToMessageList(thread, message, timestampChanged, 'created_at', addIfDoesNotExist);

          this.threads[parentID] = threadMessages;
        }
      }
    }
    /**
     * addPinnedMessages - adds messages in pinnedMessages property
     *
     * @param {Array<MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} pinnedMessages A list of pinned messages
     *
     */

  }, {
    key: "addPinnedMessages",
    value: function addPinnedMessages(pinnedMessages) {
      for (var i = 0; i < pinnedMessages.length; i += 1) {
        this.addPinnedMessage(pinnedMessages[i]);
      }
    }
    /**
     * addPinnedMessage - adds message in pinnedMessages
     *
     * @param {MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} pinnedMessage message to update
     *
     */

  }, {
    key: "addPinnedMessage",
    value: function addPinnedMessage(pinnedMessage) {
      this.pinnedMessages = this._addToMessageList(this.pinnedMessages, this.formatMessage(pinnedMessage), false, 'pinned_at');
    }
    /**
     * removePinnedMessage - removes pinned message from pinnedMessages
     *
     * @param {MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} message message to remove
     *
     */

  }, {
    key: "removePinnedMessage",
    value: function removePinnedMessage(message) {
      var _this$removeMessageFr = this.removeMessageFromArray(this.pinnedMessages, message),
          result = _this$removeMessageFr.result;

      this.pinnedMessages = result;
    }
  }, {
    key: "addReaction",
    value: function addReaction(reaction, message, enforce_unique) {
      var _this2 = this;

      if (!message) return;
      var messageWithReaction = message;

      this._updateMessage(message, function (msg) {
        messageWithReaction.own_reactions = _this2._addOwnReactionToMessage(msg.own_reactions, reaction, enforce_unique);
        return _this2.formatMessage(messageWithReaction);
      });

      return messageWithReaction;
    }
  }, {
    key: "_addOwnReactionToMessage",
    value: function _addOwnReactionToMessage(ownReactions, reaction, enforce_unique) {
      if (enforce_unique) {
        ownReactions = [];
      } else {
        ownReactions = this._removeOwnReactionFromMessage(ownReactions, reaction);
      }

      ownReactions = ownReactions || [];

      if (this._channel.getClient().userID === reaction.user_id) {
        ownReactions.push(reaction);
      }

      return ownReactions;
    }
  }, {
    key: "_removeOwnReactionFromMessage",
    value: function _removeOwnReactionFromMessage(ownReactions, reaction) {
      if (ownReactions) {
        return ownReactions.filter(function (item) {
          return item.user_id !== reaction.user_id || item.type !== reaction.type;
        });
      }

      return ownReactions;
    }
  }, {
    key: "removeReaction",
    value: function removeReaction(reaction, message) {
      var _this3 = this;

      if (!message) return;
      var messageWithReaction = message;

      this._updateMessage(message, function (msg) {
        messageWithReaction.own_reactions = _this3._removeOwnReactionFromMessage(msg.own_reactions, reaction);
        return _this3.formatMessage(messageWithReaction);
      });

      return messageWithReaction;
    }
  }, {
    key: "removeQuotedMessageReferences",
    value: function removeQuotedMessageReferences(message) {
      var parseMessage = function parseMessage(m) {
        var _m$pinned_at, _m$updated_at;

        return _objectSpread$7(_objectSpread$7({}, m), {}, {
          created_at: m.created_at.toString(),
          pinned_at: (_m$pinned_at = m.pinned_at) === null || _m$pinned_at === void 0 ? void 0 : _m$pinned_at.toString(),
          updated_at: (_m$updated_at = m.updated_at) === null || _m$updated_at === void 0 ? void 0 : _m$updated_at.toString()
        });
      };

      var updatedMessages = this.messages.filter(function (msg) {
        return msg.quoted_message_id === message.id;
      }).map(parseMessage).map(function (msg) {
        return _objectSpread$7(_objectSpread$7({}, msg), {}, {
          quoted_message: _objectSpread$7(_objectSpread$7({}, message), {}, {
            attachments: []
          })
        });
      });
      this.addMessagesSorted(updatedMessages, true);
    }
    /**
     * Updates all instances of given message in channel state
     * @param message
     * @param updateFunc
     */

  }, {
    key: "_updateMessage",
    value: function _updateMessage(message, updateFunc) {
      var parent_id = message.parent_id,
          show_in_channel = message.show_in_channel,
          pinned = message.pinned;

      if (parent_id && this.threads[parent_id]) {
        var thread = this.threads[parent_id];
        var msgIndex = thread.findIndex(function (msg) {
          return msg.id === message.id;
        });

        if (msgIndex !== -1) {
          thread[msgIndex] = updateFunc(thread[msgIndex]);
          this.threads[parent_id] = thread;
        }
      }

      if (!show_in_channel && !parent_id || show_in_channel) {
        var _msgIndex = this.messages.findIndex(function (msg) {
          return msg.id === message.id;
        });

        if (_msgIndex !== -1) {
          this.messages[_msgIndex] = updateFunc(this.messages[_msgIndex]);
        }
      }

      if (pinned) {
        var _msgIndex2 = this.pinnedMessages.findIndex(function (msg) {
          return msg.id === message.id;
        });

        if (_msgIndex2 !== -1) {
          this.pinnedMessages[_msgIndex2] = updateFunc(this.pinnedMessages[_msgIndex2]);
        }
      }
    }
    /**
     * Setter for isUpToDate.
     *
     * @param isUpToDate  Flag which indicates if channel state contain latest/recent messages or no.
     *                    This flag should be managed by UI sdks using a setter - setIsUpToDate.
     *                    When false, any new message (received by websocket event - message.new) will not
     *                    be pushed on to message list.
     */

  }, {
    key: "_addToMessageList",
    value:
    /**
     * _addToMessageList - Adds a message to a list of messages, tries to update first, appends if message isn't found
     *
     * @param {Array<ReturnType<ChannelState<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>['formatMessage']>>} messages A list of messages
     * @param message
     * @param {boolean} timestampChanged Whether updating a message with changed created_at value.
     * @param {string} sortBy field name to use to sort the messages by
     * @param {boolean} addIfDoesNotExist Add message if it is not in the list, used to prevent out of order updated messages from being added.
     */
    function _addToMessageList(messages, message) {
      var timestampChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var sortBy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'created_at';
      var addIfDoesNotExist = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var addMessageToList = addIfDoesNotExist || timestampChanged;
      var messageArr = messages; // if created_at has changed, message should be filtered and re-inserted in correct order
      // slow op but usually this only happens for a message inserted to state before actual response with correct timestamp

      if (timestampChanged) {
        messageArr = messageArr.filter(function (msg) {
          return !(msg.id && message.id === msg.id);
        });
      } // Get array length after filtering


      var messageArrayLength = messageArr.length; // for empty list just concat and return unless it's an update or deletion

      if (messageArrayLength === 0 && addMessageToList) {
        return messageArr.concat(message);
      } else if (messageArrayLength === 0) {
        return _toConsumableArray__default['default'](messageArr);
      }

      var messageTime = message[sortBy].getTime();
      var messageIsNewest = messageArr[messageArrayLength - 1][sortBy].getTime() < messageTime; // if message is newer than last item in the list concat and return unless it's an update or deletion

      if (messageIsNewest && addMessageToList) {
        return messageArr.concat(message);
      } else if (messageIsNewest) {
        return _toConsumableArray__default['default'](messageArr);
      } // find the closest index to push the new message


      var left = 0;
      var middle = 0;
      var right = messageArrayLength - 1;

      while (left <= right) {
        middle = Math.floor((right + left) / 2);
        if (messageArr[middle][sortBy].getTime() <= messageTime) left = middle + 1;else right = middle - 1;
      } // message already exists and not filtered due to timestampChanged, update and return


      if (!timestampChanged && message.id) {
        if (messageArr[left] && message.id === messageArr[left].id) {
          messageArr[left] = message;
          return _toConsumableArray__default['default'](messageArr);
        }

        if (messageArr[left - 1] && message.id === messageArr[left - 1].id) {
          messageArr[left - 1] = message;
          return _toConsumableArray__default['default'](messageArr);
        }
      } // Do not add updated or deleted messages to the list if they do not already exist
      // or have a timestamp change.


      if (addMessageToList) {
        messageArr.splice(left, 0, message);
      }

      return _toConsumableArray__default['default'](messageArr);
    }
    /**
     * removeMessage - Description
     *
     * @param {{ id: string; parent_id?: string }} messageToRemove Object of the message to remove. Needs to have at id specified.
     *
     * @return {boolean} Returns if the message was removed
     */

  }, {
    key: "removeMessage",
    value: function removeMessage(messageToRemove) {
      var isRemoved = false;

      if (messageToRemove.parent_id && this.threads[messageToRemove.parent_id]) {
        var _this$removeMessageFr2 = this.removeMessageFromArray(this.threads[messageToRemove.parent_id], messageToRemove),
            removed = _this$removeMessageFr2.removed,
            threadMessages = _this$removeMessageFr2.result;

        this.threads[messageToRemove.parent_id] = threadMessages;
        isRemoved = removed;
      } else {
        var _this$removeMessageFr3 = this.removeMessageFromArray(this.messages, messageToRemove),
            _removed = _this$removeMessageFr3.removed,
            messages = _this$removeMessageFr3.result;

        this.messages = messages;
        isRemoved = _removed;
      }

      return isRemoved;
    }
  }, {
    key: "filterErrorMessages",
    value:
    /**
     * filterErrorMessages - Removes error messages from the channel state.
     *
     */
    function filterErrorMessages() {
      var filteredMessages = this.messages.filter(function (message) {
        return message.type !== 'error';
      });
      this.messages = filteredMessages;
    }
    /**
     * clean - Remove stale data such as users that stayed in typing state for more than 5 seconds
     */

  }, {
    key: "clean",
    value: function clean() {
      var now = new Date(); // prevent old users from showing up as typing

      for (var _i = 0, _Object$entries = Object.entries(this.typing); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray__default['default'](_Object$entries[_i], 2),
            userID = _Object$entries$_i[0],
            lastEvent = _Object$entries$_i[1];

        var receivedAt = typeof lastEvent.received_at === 'string' ? new Date(lastEvent.received_at) : lastEvent.received_at || new Date();

        if (now.getTime() - receivedAt.getTime() > 7000) {
          delete this.typing[userID];

          this._channel.getClient().dispatchEvent({
            cid: this._channel.cid,
            type: 'typing.stop',
            user: {
              id: userID
            }
          });
        }
      }
    }
  }, {
    key: "clearMessages",
    value: function clearMessages() {
      this.messages = [];
      this.pinnedMessages = [];
    }
  }]);

  return ChannelState;
}();

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EVENT_MAP = {
  'channel.created': true,
  'channel.deleted': true,
  'channel.hidden': true,
  'channel.muted': true,
  'channel.truncated': true,
  'channel.unmuted': true,
  'channel.updated': true,
  'channel.visible': true,
  'health.check': true,
  'member.added': true,
  'member.removed': true,
  'member.updated': true,
  'message.deleted': true,
  'message.new': true,
  'message.read': true,
  'message.updated': true,
  'notification.added_to_channel': true,
  'notification.channel_deleted': true,
  'notification.channel_mutes_updated': true,
  'notification.channel_truncated': true,
  'notification.invite_accepted': true,
  'notification.invite_rejected': true,
  'notification.invited': true,
  'notification.mark_read': true,
  'notification.message_new': true,
  'notification.mutes_updated': true,
  'notification.removed_from_channel': true,
  'reaction.deleted': true,
  'reaction.new': true,
  'reaction.updated': true,
  'typing.start': true,
  'typing.stop': true,
  'user.banned': true,
  'user.deleted': true,
  'user.presence.changed': true,
  'user.unbanned': true,
  'user.updated': true,
  'user.watching.start': true,
  'user.watching.stop': true,
  // local events
  'connection.changed': true,
  'connection.recovered': true
};

var IS_VALID_EVENT_MAP_TYPE = _objectSpread$6(_objectSpread$6({}, EVENT_MAP), {}, {
  all: true
});

var isValidEventType = function isValidEventType(eventType) {
  return IS_VALID_EVENT_MAP_TYPE[eventType] || false;
};

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x2) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * logChatPromiseExecution - utility function for logging the execution of a promise..
 *  use this when you want to run the promise and handle errors by logging a warning
 *
 * @param {Promise<T>} promise The promise you want to run and log
 * @param {string} name    A descriptive name of what the promise does for log output
 *
 */
function logChatPromiseExecution(promise, name) {
  promise.then().catch(function (error) {
    console.warn("failed to do ".concat(name, ", ran into error: "), error);
  });
}
var sleep = function sleep(m) {
  return new Promise(function (r) {
    return setTimeout(r, m);
  });
};
function isFunction(value) {
  return value && (Object.prototype.toString.call(value) === '[object Function]' || 'function' === typeof value || value instanceof Function);
}
var chatCodes = {
  TOKEN_EXPIRED: 40,
  WS_CLOSED_SUCCESS: 1000
};

function isReadableStream(obj) {
  return obj !== null && _typeof__default['default'](obj) === 'object' && (obj.readable || typeof obj._read === 'function');
}

function isBuffer(obj) {
  return obj != null && obj.constructor != null && // @ts-expect-error
  typeof obj.constructor.isBuffer === 'function' && // @ts-expect-error
  obj.constructor.isBuffer(obj);
}

function isFileWebAPI(uri) {
  return typeof window !== 'undefined' && 'File' in window && uri instanceof File;
}

function isOwnUser(user) {
  return (user === null || user === void 0 ? void 0 : user.total_unread_count) !== undefined;
}
function isOwnUserBaseProperty(property) {
  var ownUserBaseProperties = {
    channel_mutes: true,
    devices: true,
    mutes: true,
    total_unread_count: true,
    unread_channels: true,
    unread_count: true,
    invisible: true,
    roles: true
  };
  return ownUserBaseProperties[property];
}
function addFileToFormData(uri, name, contentType) {
  var data = new FormData__default['default']();

  if (isReadableStream(uri) || isBuffer(uri) || isFileWebAPI(uri)) {
    if (name) data.append('file', uri, name);else data.append('file', uri);
  } else {
    data.append('file', {
      uri: uri,
      name: name || uri.split('/').reverse()[0],
      contentType: contentType || undefined,
      type: contentType || undefined
    });
  }

  return data;
}
function normalizeQuerySort(sort) {
  var sortFields = [];
  var sortArr = Array.isArray(sort) ? sort : [sort];

  var _iterator = _createForOfIteratorHelper$3(sortArr),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      var entries = Object.entries(item);

      if (entries.length > 1) {
        console.warn("client._buildSort() - multiple fields in a single sort object detected. Object's field order is not guaranteed");
      }

      for (var _i = 0, _entries = entries; _i < _entries.length; _i++) {
        var _entries$_i = _slicedToArray__default['default'](_entries[_i], 2),
            field = _entries$_i[0],
            direction = _entries$_i[1];

        sortFields.push({
          field: field,
          direction: direction
        });
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return sortFields;
}
/**
 * retryInterval - A retry interval which increases acc to number of failures
 *
 * @return {number} Duration to wait in milliseconds
 */

function retryInterval(numberOfFailures) {
  // try to reconnect in 0.25-25 seconds (random to spread out the load from failures)
  var max = Math.min(500 + numberOfFailures * 2000, 25000);
  var min = Math.min(Math.max(250, (numberOfFailures - 1) * 2000), 25000);
  return Math.floor(Math.random() * (max - min) + min);
}
function randomId() {
  return generateUUIDv4();
}

function hex(bytes) {
  var s = '';

  for (var i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, '0');
  }

  return s;
} // https://tools.ietf.org/html/rfc4122


function generateUUIDv4() {
  var bytes = getRandomBytes(16);
  bytes[6] = bytes[6] & 0x0f | 0x40; // version

  bytes[8] = bytes[8] & 0xbf | 0x80; // variant

  return hex(bytes.subarray(0, 4)) + '-' + hex(bytes.subarray(4, 6)) + '-' + hex(bytes.subarray(6, 8)) + '-' + hex(bytes.subarray(8, 10)) + '-' + hex(bytes.subarray(10, 16));
}

function getRandomValuesWithMathRandom(bytes) {
  var max = Math.pow(2, 8 * bytes.byteLength / bytes.length);

  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = Math.random() * max;
  }
}

var getRandomValues = function () {
  if (typeof crypto !== 'undefined') {
    return crypto.getRandomValues.bind(crypto);
  } else if (typeof msCrypto !== 'undefined') {
    return msCrypto.getRandomValues.bind(msCrypto);
  } else {
    return getRandomValuesWithMathRandom;
  }
}();

function getRandomBytes(length) {
  var bytes = new Uint8Array(length);
  getRandomValues(bytes);
  return bytes;
}

function convertErrorToJson(err) {
  var jsonObj = {};
  if (!err) return jsonObj;

  try {
    Object.getOwnPropertyNames(err).forEach(function (key) {
      jsonObj[key] = Object.getOwnPropertyDescriptor(err, key);
    });
  } catch (_) {
    return {
      error: 'failed to serialize the error'
    };
  }

  return jsonObj;
}
/**
 * isOnline safely return the navigator.online value for browser env
 * if navigator is not in global object, it always return true
 */

function isOnline() {
  var nav = typeof navigator !== 'undefined' ? navigator : typeof window !== 'undefined' && window.navigator ? window.navigator : undefined;

  if (!nav) {
    console.warn('isOnline failed to access window.navigator and assume browser is online');
    return true;
  } // RN navigator has undefined for onLine


  if (typeof nav.onLine !== 'boolean') {
    return true;
  }

  return nav.onLine;
}
/**
 * listenForConnectionChanges - Adds an event listener fired on browser going online or offline
 */

function addConnectionEventListeners(cb) {
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('offline', cb);
    window.addEventListener('online', cb);
  }
}
function removeConnectionEventListeners(cb) {
  if (typeof window !== 'undefined' && window.removeEventListener) {
    window.removeEventListener('offline', cb);
    window.removeEventListener('online', cb);
  }
}

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Channel - The Channel class manages it's own state.
 */
var Channel = /*#__PURE__*/function () {
  /**
   * constructor - Create a channel
   *
   * @param {StreamChat<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>} client the chat client
   * @param {string} type  the type of channel
   * @param {string} [id]  the id of the chat
   * @param {ChannelData<ChannelType>} data any additional custom params
   *
   * @return {Channel<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>} Returns a new uninitialized channel
   */
  function Channel(client, type, id, data) {
    var _this = this;

    _classCallCheck__default['default'](this, Channel);

    _defineProperty__default['default'](this, "_client", void 0);

    _defineProperty__default['default'](this, "type", void 0);

    _defineProperty__default['default'](this, "id", void 0);

    _defineProperty__default['default'](this, "data", void 0);

    _defineProperty__default['default'](this, "_data", void 0);

    _defineProperty__default['default'](this, "cid", void 0);

    _defineProperty__default['default'](this, "listeners", void 0);

    _defineProperty__default['default'](this, "state", void 0);

    _defineProperty__default['default'](this, "initialized", void 0);

    _defineProperty__default['default'](this, "lastKeyStroke", void 0);

    _defineProperty__default['default'](this, "lastTypingEvent", void 0);

    _defineProperty__default['default'](this, "isTyping", void 0);

    _defineProperty__default['default'](this, "disconnected", void 0);

    _defineProperty__default['default'](this, "messageFilters", void 0);

    _defineProperty__default['default'](this, "create", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee() {
      var options;
      return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = {
                watch: false,
                state: false,
                presence: false
              };
              _context.next = 3;
              return _this.query(options);

            case 3:
              return _context.abrupt("return", _context.sent);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty__default['default'](this, "_callChannelListeners", function (event) {
      var channel = _this; // gather and call the listeners

      var listeners = [];

      if (channel.listeners.all) {
        listeners.push.apply(listeners, _toConsumableArray__default['default'](channel.listeners.all));
      }

      if (channel.listeners[event.type]) {
        listeners.push.apply(listeners, _toConsumableArray__default['default'](channel.listeners[event.type]));
      } // call the event and send it to the listeners


      for (var _i = 0, _listeners = listeners; _i < _listeners.length; _i++) {
        var listener = _listeners[_i];

        if (typeof listener !== 'string') {
          listener(event);
        }
      }
    });

    _defineProperty__default['default'](this, "_channelURL", function () {
      if (!_this.id) {
        throw new Error('channel id is not defined');
      }

      return "".concat(_this.getClient().baseURL, "/channels/").concat(_this.type, "/").concat(_this.id);
    });

    var validTypeRe = /^[\w_-]+$/;
    var validIDRe = /^[\w!_-]+$/;

    if (!validTypeRe.test(type)) {
      throw new Error("Invalid chat type ".concat(type, ", letters, numbers and \"_-\" are allowed"));
    }

    if (typeof id === 'string' && !validIDRe.test(id)) {
      throw new Error("Invalid chat id ".concat(id, ", letters, numbers and \"!-_\" are allowed"));
    }

    this._client = client;
    this.type = type;
    this.id = id; // used by the frontend, gets updated:

    this.data = data; // this._data is used for the requests...

    this._data = _objectSpread$5({}, data);
    this.cid = "".concat(type, ":").concat(id);
    this.listeners = {}; // perhaps the state variable should be private

    this.state = new ChannelState(this);
    this.initialized = false;
    this.lastTypingEvent = null;
    this.isTyping = false;
    this.disconnected = false;
  }
  /**
   * getClient - Get the chat client for this channel. If client.disconnect() was called, this function will error
   *
   * @return {StreamChat<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>}
   */


  _createClass__default['default'](Channel, [{
    key: "getClient",
    value: function getClient() {
      if (this.disconnected === true) {
        throw Error("You can't use a channel after client.disconnect() was called");
      }

      return this._client;
    }
    /**
     * getConfig - Get the configs for this channel type
     *
     * @return {Record<string, unknown>}
     */

  }, {
    key: "getConfig",
    value: function getConfig() {
      var client = this.getClient();
      return client.configs[this.type];
    }
    /**
     * sendMessage - Send a message to this channel
     *
     * @param {Message<AttachmentType, MessageType, UserType>} message The Message object
     * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
     * @param {boolean} [options.skip_push] Skip sending push notifications
     *
     * @return {Promise<SendMessageAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The Server Response
     */

  }, {
    key: "sendMessage",
    value: function () {
      var _sendMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2(message, options) {
        var sendMessageResponse;
        return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getClient().post(this._channelURL() + '/message', _objectSpread$5({
                  message: message
                }, options));

              case 2:
                sendMessageResponse = _context2.sent;
                // Reset unreadCount to 0.
                this.state.unreadCount = 0;
                return _context2.abrupt("return", sendMessageResponse);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sendMessage(_x, _x2) {
        return _sendMessage.apply(this, arguments);
      }

      return sendMessage;
    }()
  }, {
    key: "sendFile",
    value: function sendFile(uri, name, contentType, user) {
      return this.getClient().sendFile("".concat(this._channelURL(), "/file"), uri, name, contentType, user);
    }
  }, {
    key: "sendImage",
    value: function sendImage(uri, name, contentType, user) {
      return this.getClient().sendFile("".concat(this._channelURL(), "/image"), uri, name, contentType, user);
    }
  }, {
    key: "deleteFile",
    value: function deleteFile(url) {
      return this.getClient().delete("".concat(this._channelURL(), "/file"), {
        url: url
      });
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(url) {
      return this.getClient().delete("".concat(this._channelURL(), "/image"), {
        url: url
      });
    }
    /**
     * sendEvent - Send an event on this channel
     *
     * @param {Event<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>} event for example {type: 'message.read'}
     *
     * @return {Promise<EventAPIResponse<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>>} The Server Response
     */

  }, {
    key: "sendEvent",
    value: function () {
      var _sendEvent = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee3(event) {
        return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this._checkInitialized();

                _context3.next = 3;
                return this.getClient().post(this._channelURL() + '/event', {
                  event: event
                });

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sendEvent(_x3) {
        return _sendEvent.apply(this, arguments);
      }

      return sendEvent;
    }()
    /**
     * search - Query messages
     *
     * @param {MessageFilters<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> | string}  query search query or object MongoDB style filters
     * @param {{client_id?: string; connection_id?: string; query?: string; message_filter_conditions?: MessageFilters<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>}} options Option object, {user_id: 'tommaso'}
     *
     * @return {Promise<SearchAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} search messages response
     */

  }, {
    key: "search",
    value: function () {
      var _search = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee4(query) {
        var options,
            payload,
            _args4 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};

                if (!(options.offset && (options.sort || options.next))) {
                  _context4.next = 3;
                  break;
                }

                throw Error("Cannot specify offset with sort or next parameters");

              case 3:
                // Return a list of channels
                payload = _objectSpread$5(_objectSpread$5({
                  filter_conditions: {
                    cid: this.cid
                  }
                }, options), {}, {
                  sort: options.sort ? normalizeQuerySort(options.sort) : undefined
                });

                if (!(typeof query === 'string')) {
                  _context4.next = 8;
                  break;
                }

                payload.query = query;
                _context4.next = 13;
                break;

              case 8:
                if (!(_typeof__default['default'](query) === 'object')) {
                  _context4.next = 12;
                  break;
                }

                payload.message_filter_conditions = query;
                _context4.next = 13;
                break;

              case 12:
                throw Error("Invalid type ".concat(_typeof__default['default'](query), " for query parameter"));

              case 13:
                _context4.next = 15;
                return this.getClient().wsPromise;

              case 15:
                _context4.next = 17;
                return this.getClient().get(this.getClient().baseURL + '/search', {
                  payload: payload
                });

              case 17:
                return _context4.abrupt("return", _context4.sent);

              case 18:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function search(_x4) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
    /**
     * queryMembers - Query Members
     *
     * @param {UserFilters<UserType>}  filterConditions object MongoDB style filters
     * @param {MemberSort<UserType>} [sort] Sort options, for instance [{created_at: -1}].
     * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{name: -1}, {created_at: 1}]
     * @param {{ limit?: number; offset?: number }} [options] Option object, {limit: 10, offset:10}
     *
     * @return {Promise<ChannelMemberAPIResponse<UserType>>} Query Members response
     */

  }, {
    key: "queryMembers",
    value: function () {
      var _queryMembers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee5(filterConditions) {
        var _this$data;

        var sort,
            options,
            id,
            type,
            members,
            _args5 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sort = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : [];
                options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
                type = this.type;

                if (this.id) {
                  id = this.id;
                } else if ((_this$data = this.data) !== null && _this$data !== void 0 && _this$data.members && Array.isArray(this.data.members)) {
                  members = this.data.members;
                } // Return a list of members


                _context5.next = 6;
                return this.getClient().get(this.getClient().baseURL + '/members', {
                  payload: _objectSpread$5({
                    type: type,
                    id: id,
                    members: members,
                    sort: normalizeQuerySort(sort),
                    filter_conditions: filterConditions
                  }, options)
                });

              case 6:
                return _context5.abrupt("return", _context5.sent);

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function queryMembers(_x5) {
        return _queryMembers.apply(this, arguments);
      }

      return queryMembers;
    }()
    /**
     * sendReaction - Send a reaction about a message
     *
     * @param {string} messageID the message id
     * @param {Reaction<ReactionType, UserType>} reaction the reaction object for instance {type: 'love'}
     * @param {{ enforce_unique?: boolean, skip_push?: boolean }} [options] Option object, {enforce_unique: true, skip_push: true} to override any existing reaction or skip sending push notifications
     *
     * @return {Promise<ReactionAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The Server Response
     */

  }, {
    key: "sendReaction",
    value: function () {
      var _sendReaction = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee6(messageID, reaction, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (messageID) {
                  _context6.next = 2;
                  break;
                }

                throw Error("Message id is missing");

              case 2:
                if (!(!reaction || Object.keys(reaction).length === 0)) {
                  _context6.next = 4;
                  break;
                }

                throw Error("Reaction object is missing");

              case 4:
                _context6.next = 6;
                return this.getClient().post(this.getClient().baseURL + "/messages/".concat(messageID, "/reaction"), _objectSpread$5({
                  reaction: reaction
                }, options));

              case 6:
                return _context6.abrupt("return", _context6.sent);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function sendReaction(_x6, _x7, _x8) {
        return _sendReaction.apply(this, arguments);
      }

      return sendReaction;
    }()
    /**
     * deleteReaction - Delete a reaction by user and type
     *
     * @param {string} messageID the id of the message from which te remove the reaction
     * @param {string} reactionType the type of reaction that should be removed
     * @param {string} [user_id] the id of the user (used only for server side request) default null
     *
     * @return {Promise<ReactionAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The Server Response
     */

  }, {
    key: "deleteReaction",
    value: function deleteReaction(messageID, reactionType, user_id) {
      this._checkInitialized();

      if (!reactionType || !messageID) {
        throw Error('Deleting a reaction requires specifying both the message and reaction type');
      }

      var url = this.getClient().baseURL + "/messages/".concat(messageID, "/reaction/").concat(reactionType); //provided when server side request

      if (user_id) {
        return this.getClient().delete(url, {
          user_id: user_id
        });
      }

      return this.getClient().delete(url, {});
    }
    /**
     * update - Edit the channel's custom properties
     *
     * @param {ChannelData<ChannelType>} channelData The object to update the custom properties of this channel with
     * @param {Message<AttachmentType, MessageType, UserType>} [updateMessage] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "update",
    value: function () {
      var _update2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee7() {
        var channelData,
            updateMessage,
            options,
            reserved,
            _args7 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                channelData = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
                updateMessage = _args7.length > 1 ? _args7[1] : undefined;
                options = _args7.length > 2 ? _args7[2] : undefined;
                // Strip out reserved names that will result in API errors.
                reserved = ['config', 'cid', 'created_by', 'id', 'member_count', 'type', 'created_at', 'updated_at', 'last_message_at', 'own_capabilities'];
                reserved.forEach(function (key) {
                  delete channelData[key];
                });
                _context7.next = 7;
                return this._update(_objectSpread$5({
                  message: updateMessage,
                  data: channelData
                }, options));

              case 7:
                return _context7.abrupt("return", _context7.sent);

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
    /**
     * updatePartial - partial update channel properties
     *
     * @param {PartialUpdateChannel<ChannelType>} partial update request
     *
     * @return {Promise<PartialUpdateChannelAPIResponse<ChannelType,CommandType, UserType>>}
     */

  }, {
    key: "updatePartial",
    value: function () {
      var _updatePartial = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee8(update) {
        return _regeneratorRuntime__default['default'].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getClient().patch(this._channelURL(), update);

              case 2:
                return _context8.abrupt("return", _context8.sent);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function updatePartial(_x9) {
        return _updatePartial.apply(this, arguments);
      }

      return updatePartial;
    }()
    /**
     * enableSlowMode - enable slow mode
     *
     * @param {number} coolDownInterval the cooldown interval in seconds
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "enableSlowMode",
    value: function () {
      var _enableSlowMode = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee9(coolDownInterval) {
        var data;
        return _regeneratorRuntime__default['default'].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getClient().post(this._channelURL(), {
                  cooldown: coolDownInterval
                });

              case 2:
                data = _context9.sent;
                this.data = data.channel;
                return _context9.abrupt("return", data);

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function enableSlowMode(_x10) {
        return _enableSlowMode.apply(this, arguments);
      }

      return enableSlowMode;
    }()
    /**
     * disableSlowMode - disable slow mode
     *
     * @return {Promise<UpdateChannelAPIResponse<ChannelType, AttachmentType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "disableSlowMode",
    value: function () {
      var _disableSlowMode = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee10() {
        var data;
        return _regeneratorRuntime__default['default'].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.getClient().post(this._channelURL(), {
                  cooldown: 0
                });

              case 2:
                data = _context10.sent;
                this.data = data.channel;
                return _context10.abrupt("return", data);

              case 5:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function disableSlowMode() {
        return _disableSlowMode.apply(this, arguments);
      }

      return disableSlowMode;
    }()
    /**
     * delete - Delete the channel. Messages are permanently removed.
     *
     * @return {Promise<DeleteChannelAPIResponse<ChannelType, CommandType, UserType>>} The server response
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee11() {
        return _regeneratorRuntime__default['default'].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.getClient().delete(this._channelURL(), {});

              case 2:
                return _context11.abrupt("return", _context11.sent);

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function _delete() {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
    /**
     * truncate - Removes all messages from the channel
     * @param {TruncateOptions<AttachmentType, MessageType, UserType>} [options] Defines truncation options
     * @return {Promise<TruncateChannelAPIResponse<ChannelType, CommandType, UserType, MessageType, ReactionType>>} The server response
     */

  }, {
    key: "truncate",
    value: function () {
      var _truncate = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee12() {
        var options,
            _args12 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                options = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : {};
                _context12.next = 3;
                return this.getClient().post(this._channelURL() + '/truncate', options);

              case 3:
                return _context12.abrupt("return", _context12.sent);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function truncate() {
        return _truncate.apply(this, arguments);
      }

      return truncate;
    }()
    /**
     * acceptInvite - accept invitation to the channel
     *
     * @param {InviteOptions<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} [options] The object to update the custom properties of this channel with
     *
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "acceptInvite",
    value: function () {
      var _acceptInvite = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee13() {
        var options,
            _args13 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                options = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : {};
                _context13.next = 3;
                return this._update(_objectSpread$5({
                  accept_invite: true
                }, options));

              case 3:
                return _context13.abrupt("return", _context13.sent);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function acceptInvite() {
        return _acceptInvite.apply(this, arguments);
      }

      return acceptInvite;
    }()
    /**
     * rejectInvite - reject invitation to the channel
     *
     * @param {InviteOptions<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} [options] The object to update the custom properties of this channel with
     *
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "rejectInvite",
    value: function () {
      var _rejectInvite = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee14() {
        var options,
            _args14 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                options = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {};
                _context14.next = 3;
                return this._update(_objectSpread$5({
                  reject_invite: true
                }, options));

              case 3:
                return _context14.abrupt("return", _context14.sent);

              case 4:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function rejectInvite() {
        return _rejectInvite.apply(this, arguments);
      }

      return rejectInvite;
    }()
    /**
     * addMembers - add members to the channel
     *
     * @param {{user_id: string, channel_role?: Role}[]} members An array of members to add to the channel
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "addMembers",
    value: function () {
      var _addMembers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee15(members, message) {
        var options,
            _args15 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                options = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : {};
                _context15.next = 3;
                return this._update(_objectSpread$5({
                  add_members: members,
                  message: message
                }, options));

              case 3:
                return _context15.abrupt("return", _context15.sent);

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function addMembers(_x11, _x12) {
        return _addMembers.apply(this, arguments);
      }

      return addMembers;
    }()
    /**
     * addModerators - add moderators to the channel
     *
     * @param {string[]} members An array of member identifiers
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "addModerators",
    value: function () {
      var _addModerators = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee16(members, message) {
        var options,
            _args16 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                options = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : {};
                _context16.next = 3;
                return this._update(_objectSpread$5({
                  add_moderators: members,
                  message: message
                }, options));

              case 3:
                return _context16.abrupt("return", _context16.sent);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function addModerators(_x13, _x14) {
        return _addModerators.apply(this, arguments);
      }

      return addModerators;
    }()
    /**
     * assignRoles - sets member roles in a channel
     *
     * @param {{channel_role: Role, user_id: string}[]} roles List of role assignments
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "assignRoles",
    value: function () {
      var _assignRoles = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee17(roles, message) {
        var options,
            _args17 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                options = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : {};
                _context17.next = 3;
                return this._update(_objectSpread$5({
                  assign_roles: roles,
                  message: message
                }, options));

              case 3:
                return _context17.abrupt("return", _context17.sent);

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function assignRoles(_x15, _x16) {
        return _assignRoles.apply(this, arguments);
      }

      return assignRoles;
    }()
    /**
     * inviteMembers - invite members to the channel
     *
     * @param {{user_id: string, channel_role?: Role}[]} members An array of members to invite to the channel
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "inviteMembers",
    value: function () {
      var _inviteMembers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee18(members, message) {
        var options,
            _args18 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                options = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : {};
                _context18.next = 3;
                return this._update(_objectSpread$5({
                  invites: members,
                  message: message
                }, options));

              case 3:
                return _context18.abrupt("return", _context18.sent);

              case 4:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function inviteMembers(_x17, _x18) {
        return _inviteMembers.apply(this, arguments);
      }

      return inviteMembers;
    }()
    /**
     * removeMembers - remove members from channel
     *
     * @param {string[]} members An array of member identifiers
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "removeMembers",
    value: function () {
      var _removeMembers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee19(members, message) {
        var options,
            _args19 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                options = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : {};
                _context19.next = 3;
                return this._update(_objectSpread$5({
                  remove_members: members,
                  message: message
                }, options));

              case 3:
                return _context19.abrupt("return", _context19.sent);

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function removeMembers(_x19, _x20) {
        return _removeMembers.apply(this, arguments);
      }

      return removeMembers;
    }()
    /**
     * demoteModerators - remove moderator role from channel members
     *
     * @param {string[]} members An array of member identifiers
     * @param {Message<AttachmentType, MessageType, UserType>} [message] Optional message object for channel members notification
     * @param {ChannelUpdateOptions} [options] Option object, configuration to control the behavior while updating
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "demoteModerators",
    value: function () {
      var _demoteModerators = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee20(members, message) {
        var options,
            _args20 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                options = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : {};
                _context20.next = 3;
                return this._update(_objectSpread$5({
                  demote_moderators: members,
                  message: message
                }, options));

              case 3:
                return _context20.abrupt("return", _context20.sent);

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function demoteModerators(_x21, _x22) {
        return _demoteModerators.apply(this, arguments);
      }

      return demoteModerators;
    }()
    /**
     * _update - executes channel update request
     * @param payload Object Update Channel payload
     * @return {Promise<UpdateChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     * TODO: introduce new type instead of Object in the next major update
     */

  }, {
    key: "_update",
    value: function () {
      var _update3 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee21(payload) {
        var data;
        return _regeneratorRuntime__default['default'].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.getClient().post(this._channelURL(), payload);

              case 2:
                data = _context21.sent;
                this.data = data.channel;
                return _context21.abrupt("return", data);

              case 5:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function _update(_x23) {
        return _update3.apply(this, arguments);
      }

      return _update;
    }()
    /**
     * mute - mutes the current channel
     * @param {{ user_id?: string, expiration?: string }} opts expiration in minutes or user_id
     * @return {Promise<MuteChannelAPIResponse<ChannelType, CommandType, UserType>>} The server response
     *
     * example with expiration:
     * await channel.mute({expiration: moment.duration(2, 'weeks')});
     *
     * example server side:
     * await channel.mute({user_id: userId});
     *
     */

  }, {
    key: "mute",
    value: function () {
      var _mute = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee22() {
        var opts,
            _args22 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                opts = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : {};
                _context22.next = 3;
                return this.getClient().post(this.getClient().baseURL + '/moderation/mute/channel', _objectSpread$5({
                  channel_cid: this.cid
                }, opts));

              case 3:
                return _context22.abrupt("return", _context22.sent);

              case 4:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function mute() {
        return _mute.apply(this, arguments);
      }

      return mute;
    }()
    /**
     * unmute - mutes the current channel
     * @param {{ user_id?: string}} opts user_id
     * @return {Promise<APIResponse>} The server response
     *
     * example server side:
     * await channel.unmute({user_id: userId});
     */

  }, {
    key: "unmute",
    value: function () {
      var _unmute = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee23() {
        var opts,
            _args23 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                opts = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : {};
                _context23.next = 3;
                return this.getClient().post(this.getClient().baseURL + '/moderation/unmute/channel', _objectSpread$5({
                  channel_cid: this.cid
                }, opts));

              case 3:
                return _context23.abrupt("return", _context23.sent);

              case 4:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function unmute() {
        return _unmute.apply(this, arguments);
      }

      return unmute;
    }()
    /**
     * muteStatus - returns the mute status for the current channel
     * @return {{ muted: boolean; createdAt: Date | null; expiresAt: Date | null }} { muted: true | false, createdAt: Date | null, expiresAt: Date | null}
     */

  }, {
    key: "muteStatus",
    value: function muteStatus() {
      this._checkInitialized();

      return this.getClient()._muteStatus(this.cid);
    }
  }, {
    key: "sendAction",
    value: function sendAction(messageID, formData) {
      this._checkInitialized();

      if (!messageID) {
        throw Error("Message id is missing");
      }

      return this.getClient().post(this.getClient().baseURL + "/messages/".concat(messageID, "/action"), {
        message_id: messageID,
        form_data: formData,
        id: this.id,
        type: this.type
      });
    }
    /**
     * keystroke - First of the typing.start and typing.stop events based on the users keystrokes.
     * Call this on every keystroke
     * @see {@link https://getstream.io/chat/docs/typing_indicators/?language=js|Docs}
     * @param {string} [parent_id] set this field to `message.id` to indicate that typing event is happening in a thread
     */

  }, {
    key: "keystroke",
    value: function () {
      var _keystroke = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee24(parent_id) {
        var _this$getConfig;

        var now, diff;
        return _regeneratorRuntime__default['default'].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                if ((_this$getConfig = this.getConfig()) !== null && _this$getConfig !== void 0 && _this$getConfig.typing_events) {
                  _context24.next = 2;
                  break;
                }

                return _context24.abrupt("return");

              case 2:
                now = new Date();
                diff = this.lastTypingEvent && now.getTime() - this.lastTypingEvent.getTime();
                this.lastKeyStroke = now;
                this.isTyping = true; // send a typing.start every 2 seconds

                if (!(diff === null || diff > 2000)) {
                  _context24.next = 10;
                  break;
                }

                this.lastTypingEvent = new Date();
                _context24.next = 10;
                return this.sendEvent({
                  type: 'typing.start',
                  parent_id: parent_id
                });

              case 10:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function keystroke(_x24) {
        return _keystroke.apply(this, arguments);
      }

      return keystroke;
    }()
    /**
     * stopTyping - Sets last typing to null and sends the typing.stop event
     * @see {@link https://getstream.io/chat/docs/typing_indicators/?language=js|Docs}
     * @param {string} [parent_id] set this field to `message.id` to indicate that typing event is happening in a thread
     */

  }, {
    key: "stopTyping",
    value: function () {
      var _stopTyping = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee25(parent_id) {
        var _this$getConfig2;

        return _regeneratorRuntime__default['default'].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                if ((_this$getConfig2 = this.getConfig()) !== null && _this$getConfig2 !== void 0 && _this$getConfig2.typing_events) {
                  _context25.next = 2;
                  break;
                }

                return _context25.abrupt("return");

              case 2:
                this.lastTypingEvent = null;
                this.isTyping = false;
                _context25.next = 6;
                return this.sendEvent({
                  type: 'typing.stop',
                  parent_id: parent_id
                });

              case 6:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function stopTyping(_x25) {
        return _stopTyping.apply(this, arguments);
      }

      return stopTyping;
    }()
    /**
     * lastMessage - return the last message, takes into account that last few messages might not be perfectly sorted
     *
     * @return {ReturnType<ChannelState<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>['formatMessage']> | undefined} Description
     */

  }, {
    key: "lastMessage",
    value: function lastMessage() {
      // get last 5 messages, sort, return the latest
      // get a slice of the last 5
      var min = this.state.messages.length - 5;

      if (min < 0) {
        min = 0;
      }

      var max = this.state.messages.length + 1;
      var messageSlice = this.state.messages.slice(min, max); // sort by pk desc

      messageSlice.sort(function (a, b) {
        return b.created_at.getTime() - a.created_at.getTime();
      });
      return messageSlice[0];
    }
    /**
     * markRead - Send the mark read event for this user, only works if the `read_events` setting is enabled
     *
     * @param {MarkReadOptions<UserType>} data
     * @return {Promise<EventAPIResponse<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType> | null>} Description
     */

  }, {
    key: "markRead",
    value: function () {
      var _markRead = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee26() {
        var _this$getConfig3;

        var data,
            _args26 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                data = _args26.length > 0 && _args26[0] !== undefined ? _args26[0] : {};

                this._checkInitialized();

                if ((_this$getConfig3 = this.getConfig()) !== null && _this$getConfig3 !== void 0 && _this$getConfig3.read_events) {
                  _context26.next = 4;
                  break;
                }

                return _context26.abrupt("return", Promise.resolve(null));

              case 4:
                _context26.next = 6;
                return this.getClient().post(this._channelURL() + '/read', _objectSpread$5({}, data));

              case 6:
                return _context26.abrupt("return", _context26.sent);

              case 7:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function markRead() {
        return _markRead.apply(this, arguments);
      }

      return markRead;
    }()
    /**
     * clean - Cleans the channel state and fires stop typing if needed
     */

  }, {
    key: "clean",
    value: function clean() {
      if (this.lastKeyStroke) {
        var now = new Date();
        var diff = now.getTime() - this.lastKeyStroke.getTime();

        if (diff > 1000 && this.isTyping) {
          logChatPromiseExecution(this.stopTyping(), 'stop typing event');
        }
      }

      this.state.clean();
    }
    /**
     * watch - Loads the initial channel state and watches for changes
     *
     * @param {ChannelQueryOptions<ChannelType, CommandType, UserType>} options additional options for the query endpoint
     *
     * @return {Promise<ChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The server response
     */

  }, {
    key: "watch",
    value: function () {
      var _watch = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee27(options) {
        var defaultOptions, combined, state;
        return _regeneratorRuntime__default['default'].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                defaultOptions = {
                  state: true,
                  watch: true,
                  presence: false
                }; // Make sure we wait for the connect promise if there is a pending one

                _context27.next = 3;
                return this.getClient().wsPromise;

              case 3:
                if (!this.getClient()._hasConnectionID()) {
                  defaultOptions.watch = false;
                }

                combined = _objectSpread$5(_objectSpread$5({}, defaultOptions), options);
                _context27.next = 7;
                return this.query(combined);

              case 7:
                state = _context27.sent;
                this.messageFilters = combined.messages;
                this.initialized = true;
                this.data = state.channel;

                this._client.logger('info', "channel:watch() - started watching channel ".concat(this.cid), {
                  tags: ['channel'],
                  channel: this
                });

                return _context27.abrupt("return", state);

              case 13:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function watch(_x26) {
        return _watch.apply(this, arguments);
      }

      return watch;
    }()
    /**
     * stopWatching - Stops watching the channel
     *
     * @return {Promise<APIResponse>} The server response
     */

  }, {
    key: "stopWatching",
    value: function () {
      var _stopWatching = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee28() {
        var response;
        return _regeneratorRuntime__default['default'].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return this.getClient().post(this._channelURL() + '/stop-watching', {});

              case 2:
                response = _context28.sent;

                this._client.logger('info', "channel:watch() - stopped watching channel ".concat(this.cid), {
                  tags: ['channel'],
                  channel: this
                });

                return _context28.abrupt("return", response);

              case 5:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function stopWatching() {
        return _stopWatching.apply(this, arguments);
      }

      return stopWatching;
    }()
    /**
     * getReplies - List the message replies for a parent message
     *
     * @param {string} parent_id The message parent id, ie the top of the thread
     * @param {PaginationOptions & { user?: UserResponse<UserType>; user_id?: string }} options Pagination params, ie {limit:10, id_lte: 10}
     *
     * @return {Promise<GetRepliesAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} A response with a list of messages
     */

  }, {
    key: "getReplies",
    value: function () {
      var _getReplies = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee29(parent_id, options) {
        var data;
        return _regeneratorRuntime__default['default'].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return this.getClient().get(this.getClient().baseURL + "/messages/".concat(parent_id, "/replies"), _objectSpread$5({}, options));

              case 2:
                data = _context29.sent;

                // add any messages to our thread state
                if (data.messages) {
                  this.state.addMessagesSorted(data.messages);
                }

                return _context29.abrupt("return", data);

              case 5:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function getReplies(_x27, _x28) {
        return _getReplies.apply(this, arguments);
      }

      return getReplies;
    }()
    /**
     * getReactions - List the reactions, supports pagination
     *
     * @param {string} message_id The message id
     * @param {{ limit?: number; offset?: number }} options The pagination options
     *
     * @return {Promise<GetReactionsAPIResponse<ReactionType, UserType>>} Server response
     */

  }, {
    key: "getReactions",
    value: function getReactions(message_id, options) {
      return this.getClient().get(this.getClient().baseURL + "/messages/".concat(message_id, "/reactions"), _objectSpread$5({}, options));
    }
    /**
     * getMessagesById - Retrieves a list of messages by ID
     *
     * @param {string[]} messageIds The ids of the messages to retrieve from this channel
     *
     * @return {Promise<GetMultipleMessagesAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} Server response
     */

  }, {
    key: "getMessagesById",
    value: function getMessagesById(messageIds) {
      return this.getClient().get(this._channelURL() + '/messages', {
        ids: messageIds.join(',')
      });
    }
    /**
     * lastRead - returns the last time the user marked the channel as read if the user never marked the channel as read, this will return null
     * @return {Date | null | undefined}
     */

  }, {
    key: "lastRead",
    value: function lastRead() {
      this._checkInitialized();

      var _this$getClient = this.getClient(),
          userID = _this$getClient.userID;

      if (userID) {
        return this.state.read[userID] ? this.state.read[userID].last_read : null;
      }
    }
  }, {
    key: "_countMessageAsUnread",
    value: function _countMessageAsUnread(message) {
      var _message$user, _message$user2;

      if (message.shadowed) return false;
      if (message.silent) return false;
      if (((_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.id) === this.getClient().userID) return false;
      if ((_message$user2 = message.user) !== null && _message$user2 !== void 0 && _message$user2.id && this.getClient().userMuteStatus(message.user.id)) return false;
      if (message.type === 'system') return false;
      if (this.muteStatus().muted) return false;
      return true;
    }
    /**
     * countUnread - Count of unread messages
     *
     * @param {Date | null} [lastRead] lastRead the time that the user read a message, defaults to current user's read state
     *
     * @return {number} Unread count
     */

  }, {
    key: "countUnread",
    value: function countUnread(lastRead) {
      if (!lastRead) return this.state.unreadCount;
      var count = 0;

      for (var i = 0; i < this.state.messages.length; i += 1) {
        var message = this.state.messages[i];

        if (message.created_at > lastRead && this._countMessageAsUnread(message)) {
          count++;
        }
      }

      return count;
    }
    /**
     * countUnread - Count the number of unread messages mentioning the current user
     *
     * @return {number} Unread mentions count
     */

  }, {
    key: "countUnreadMentions",
    value: function countUnreadMentions() {
      var lastRead = this.lastRead();
      var userID = this.getClient().userID;
      var count = 0;

      for (var i = 0; i < this.state.messages.length; i += 1) {
        var _message$mentioned_us;

        var message = this.state.messages[i];

        if (this._countMessageAsUnread(message) && (!lastRead || message.created_at > lastRead) && (_message$mentioned_us = message.mentioned_users) !== null && _message$mentioned_us !== void 0 && _message$mentioned_us.some(function (user) {
          return user.id === userID;
        })) {
          count++;
        }
      }

      return count;
    }
    /**
     * create - Creates a new channel
     *
     * @return {Promise<ChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} The Server Response
     */

  }, {
    key: "query",
    value:
    /**
     * query - Query the API, get messages, members or other channel fields
     *
     * @param {ChannelQueryOptions<ChannelType, CommandType, UserType>} options The query options
     *
     * @return {Promise<ChannelAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} Returns a query response
     */
    function () {
      var _query = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee30(options) {
        var queryURL, state, membersStr, tempChannelCid;
        return _regeneratorRuntime__default['default'].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return this.getClient().wsPromise;

              case 2:
                queryURL = "".concat(this.getClient().baseURL, "/channels/").concat(this.type);

                if (this.id) {
                  queryURL += "/".concat(this.id);
                }

                _context30.next = 6;
                return this.getClient().post(queryURL + '/query', _objectSpread$5({
                  data: this._data,
                  state: true
                }, options));

              case 6:
                state = _context30.sent;

                // update the channel id if it was missing
                if (!this.id) {
                  this.id = state.channel.id;
                  this.cid = state.channel.cid; // set the channel as active...

                  membersStr = state.members.map(function (member) {
                    var _member$user;

                    return member.user_id || ((_member$user = member.user) === null || _member$user === void 0 ? void 0 : _member$user.id);
                  }).sort().join(',');
                  tempChannelCid = "".concat(this.type, ":!members-").concat(membersStr);

                  if (tempChannelCid in this.getClient().activeChannels) {
                    // This gets set in `client.channel()` function, when channel is created
                    // using members, not id.
                    delete this.getClient().activeChannels[tempChannelCid];
                  }

                  if (!(this.cid in this.getClient().activeChannels)) {
                    this.getClient().activeChannels[this.cid] = this;
                  }
                }

                this.getClient()._addChannelConfig(state); // add any messages to our channel state


                this._initializeState(state);

                return _context30.abrupt("return", state);

              case 11:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function query(_x29) {
        return _query.apply(this, arguments);
      }

      return query;
    }()
    /**
     * banUser - Bans a user from a channel
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} options
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "banUser",
    value: function () {
      var _banUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee31(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                this._checkInitialized();

                _context31.next = 3;
                return this.getClient().banUser(targetUserID, _objectSpread$5(_objectSpread$5({}, options), {}, {
                  type: this.type,
                  id: this.id
                }));

              case 3:
                return _context31.abrupt("return", _context31.sent);

              case 4:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function banUser(_x30, _x31) {
        return _banUser.apply(this, arguments);
      }

      return banUser;
    }()
    /**
     * hides the channel from queryChannels for the user until a message is added
     * If clearHistory is set to true - all messages will be removed for the user
     *
     * @param {string | null} userId
     * @param {boolean} clearHistory
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "hide",
    value: function () {
      var _hide = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee32() {
        var userId,
            clearHistory,
            _args32 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                userId = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : null;
                clearHistory = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : false;

                this._checkInitialized();

                _context32.next = 5;
                return this.getClient().post("".concat(this._channelURL(), "/hide"), {
                  user_id: userId,
                  clear_history: clearHistory
                });

              case 5:
                return _context32.abrupt("return", _context32.sent);

              case 6:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function hide() {
        return _hide.apply(this, arguments);
      }

      return hide;
    }()
    /**
     * removes the hidden status for a channel
     *
     * @param {string | null} userId
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "show",
    value: function () {
      var _show = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee33() {
        var userId,
            _args33 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                userId = _args33.length > 0 && _args33[0] !== undefined ? _args33[0] : null;

                this._checkInitialized();

                _context33.next = 4;
                return this.getClient().post("".concat(this._channelURL(), "/show"), {
                  user_id: userId
                });

              case 4:
                return _context33.abrupt("return", _context33.sent);

              case 5:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function show() {
        return _show.apply(this, arguments);
      }

      return show;
    }()
    /**
     * unbanUser - Removes the bans for a user on a channel
     *
     * @param {string} targetUserID
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "unbanUser",
    value: function () {
      var _unbanUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee34(targetUserID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                this._checkInitialized();

                _context34.next = 3;
                return this.getClient().unbanUser(targetUserID, {
                  type: this.type,
                  id: this.id
                });

              case 3:
                return _context34.abrupt("return", _context34.sent);

              case 4:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function unbanUser(_x32) {
        return _unbanUser.apply(this, arguments);
      }

      return unbanUser;
    }()
    /**
     * shadowBan - Shadow bans a user from a channel
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} options
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "shadowBan",
    value: function () {
      var _shadowBan = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee35(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                this._checkInitialized();

                _context35.next = 3;
                return this.getClient().shadowBan(targetUserID, _objectSpread$5(_objectSpread$5({}, options), {}, {
                  type: this.type,
                  id: this.id
                }));

              case 3:
                return _context35.abrupt("return", _context35.sent);

              case 4:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function shadowBan(_x33, _x34) {
        return _shadowBan.apply(this, arguments);
      }

      return shadowBan;
    }()
    /**
     * removeShadowBan - Removes the shadow ban for a user on a channel
     *
     * @param {string} targetUserID
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "removeShadowBan",
    value: function () {
      var _removeShadowBan = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee36(targetUserID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                this._checkInitialized();

                _context36.next = 3;
                return this.getClient().removeShadowBan(targetUserID, {
                  type: this.type,
                  id: this.id
                });

              case 3:
                return _context36.abrupt("return", _context36.sent);

              case 4:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function removeShadowBan(_x35) {
        return _removeShadowBan.apply(this, arguments);
      }

      return removeShadowBan;
    }()
    /**
     * on - Listen to events on this channel.
     *
     * channel.on('message.new', event => {console.log("my new message", event, channel.state.messages)})
     * or
     * channel.on(event => {console.log(event.type)})
     *
     * @param {EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType> | EventTypes} callbackOrString  The event type to listen for (optional)
     * @param {EventHandler<AttachmentType, ChannelType, CommandType, EventType, MessageType, ReactionType, UserType>} [callbackOrNothing] The callback to call
     */

  }, {
    key: "on",
    value: function on(callbackOrString, callbackOrNothing) {
      var _this2 = this;

      var key = callbackOrNothing ? callbackOrString : 'all';
      var valid = isValidEventType(key);

      if (!valid) {
        throw Error("Invalid event type ".concat(key));
      }

      var callback = callbackOrNothing ? callbackOrNothing : callbackOrString;

      if (!(key in this.listeners)) {
        this.listeners[key] = [];
      }

      this._client.logger('info', "Attaching listener for ".concat(key, " event on channel ").concat(this.cid), {
        tags: ['event', 'channel'],
        channel: this
      });

      this.listeners[key].push(callback);
      return {
        unsubscribe: function unsubscribe() {
          _this2._client.logger('info', "Removing listener for ".concat(key, " event from channel ").concat(_this2.cid), {
            tags: ['event', 'channel'],
            channel: _this2
          });

          _this2.listeners[key] = _this2.listeners[key].filter(function (el) {
            return el !== callback;
          });
        }
      };
    }
    /**
     * off - Remove the event handler
     *
     */

  }, {
    key: "off",
    value: function off(callbackOrString, callbackOrNothing) {
      var key = callbackOrNothing ? callbackOrString : 'all';
      var valid = isValidEventType(key);

      if (!valid) {
        throw Error("Invalid event type ".concat(key));
      }

      var callback = callbackOrNothing ? callbackOrNothing : callbackOrString;

      if (!(key in this.listeners)) {
        this.listeners[key] = [];
      }

      this._client.logger('info', "Removing listener for ".concat(key, " event from channel ").concat(this.cid), {
        tags: ['event', 'channel'],
        channel: this
      });

      this.listeners[key] = this.listeners[key].filter(function (value) {
        return value !== callback;
      });
    } // eslint-disable-next-line sonarjs/cognitive-complexity

  }, {
    key: "_handleChannelEvent",
    value: function _handleChannelEvent(event) {
      var _event$user, _event$user2, _event$user3, _event$user5, _event$user6, _event$member, _event$user9;

      var channel = this;

      this._client.logger('info', "channel:_handleChannelEvent - Received event of type { ".concat(event.type, " } on ").concat(this.cid), {
        tags: ['event', 'channel'],
        channel: this
      });

      var channelState = channel.state;

      switch (event.type) {
        case 'typing.start':
          if ((_event$user = event.user) !== null && _event$user !== void 0 && _event$user.id) {
            channelState.typing[event.user.id] = event;
          }

          break;

        case 'typing.stop':
          if ((_event$user2 = event.user) !== null && _event$user2 !== void 0 && _event$user2.id) {
            delete channelState.typing[event.user.id];
          }

          break;

        case 'message.read':
          if ((_event$user3 = event.user) !== null && _event$user3 !== void 0 && _event$user3.id) {
            var _event$user4, _this$getClient$user;

            channelState.read[event.user.id] = {
              // because in client.ts the handleEvent call that flows to this sets this `event.received_at = new Date();`
              last_read: event.received_at,
              user: event.user
            };

            if (((_event$user4 = event.user) === null || _event$user4 === void 0 ? void 0 : _event$user4.id) === ((_this$getClient$user = this.getClient().user) === null || _this$getClient$user === void 0 ? void 0 : _this$getClient$user.id)) {
              channelState.unreadCount = 0;
            }
          }

          break;

        case 'user.watching.start':
        case 'user.updated':
          if ((_event$user5 = event.user) !== null && _event$user5 !== void 0 && _event$user5.id) {
            channelState.watchers[event.user.id] = event.user;
          }

          break;

        case 'user.watching.stop':
          if ((_event$user6 = event.user) !== null && _event$user6 !== void 0 && _event$user6.id) {
            delete channelState.watchers[event.user.id];
          }

          break;

        case 'message.deleted':
          if (event.message) {
            if (event.hard_delete) channelState.removeMessage(event.message);else channelState.addMessageSorted(event.message, false, false);
            channelState.removeQuotedMessageReferences(event.message);

            if (event.message.pinned) {
              channelState.removePinnedMessage(event.message);
            }
          }

          break;

        case 'message.new':
          if (event.message) {
            var _event$user7, _this$getClient$user2, _event$user8;

            /* if message belongs to current user, always assume timestamp is changed to filter it out and add again to avoid duplication */
            var ownMessage = ((_event$user7 = event.user) === null || _event$user7 === void 0 ? void 0 : _event$user7.id) === ((_this$getClient$user2 = this.getClient().user) === null || _this$getClient$user2 === void 0 ? void 0 : _this$getClient$user2.id);
            var isThreadMessage = event.message.parent_id && !event.message.show_in_channel;

            if (this.state.isUpToDate || isThreadMessage) {
              channelState.addMessageSorted(event.message, ownMessage);
            }

            if (event.message.pinned) {
              channelState.addPinnedMessage(event.message);
            }

            if (ownMessage && (_event$user8 = event.user) !== null && _event$user8 !== void 0 && _event$user8.id) {
              channelState.unreadCount = 0;
              channelState.read[event.user.id] = {
                last_read: new Date(event.created_at),
                user: event.user
              };
            } else if (this._countMessageAsUnread(event.message)) {
              channelState.unreadCount = channelState.unreadCount + 1;
            }
          }

          break;

        case 'message.updated':
          if (event.message) {
            channelState.addMessageSorted(event.message, false, false);

            if (event.message.pinned) {
              channelState.addPinnedMessage(event.message);
            } else {
              channelState.removePinnedMessage(event.message);
            }
          }

          break;

        case 'channel.truncated':
          channelState.clearMessages();
          channelState.unreadCount = 0;
          break;

        case 'member.added':
        case 'member.updated':
          if ((_event$member = event.member) !== null && _event$member !== void 0 && _event$member.user_id) {
            channelState.members[event.member.user_id] = event.member;
          }

          break;

        case 'member.removed':
          if ((_event$user9 = event.user) !== null && _event$user9 !== void 0 && _event$user9.id) {
            delete channelState.members[event.user.id];
          }

          break;

        case 'channel.updated':
          if (event.channel) {
            channel.data = event.channel;
          }

          break;

        case 'reaction.new':
          if (event.message && event.reaction) {
            event.message = channelState.addReaction(event.reaction, event.message);
          }

          break;

        case 'reaction.deleted':
          if (event.reaction) {
            event.message = channelState.removeReaction(event.reaction, event.message);
          }

          break;

        case 'reaction.updated':
          if (event.reaction) {
            // assuming reaction.updated is only called if enforce_unique is true
            event.message = channelState.addReaction(event.reaction, event.message, true);
          }

          break;

        case 'channel.hidden':
          if (event.clear_history) {
            channelState.clearMessages();
          }

          break;
      } // any event can send over the online count


      if (event.watcher_count !== undefined) {
        channel.state.watcher_count = event.watcher_count;
      }
    }
  }, {
    key: "_checkInitialized",
    value: function _checkInitialized() {
      if (!this.initialized && !this.getClient()._isUsingServerAuth()) {
        throw Error("Channel ".concat(this.cid, " hasn't been initialized yet. Make sure to call .watch() and wait for it to resolve"));
      }
    } // eslint-disable-next-line sonarjs/cognitive-complexity

  }, {
    key: "_initializeState",
    value: function _initializeState(state) {
      var _this$getClient2 = this.getClient(),
          clientState = _this$getClient2.state,
          user = _this$getClient2.user,
          userID = _this$getClient2.userID; // add the Users


      if (state.members) {
        var _iterator = _createForOfIteratorHelper$2(state.members),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var member = _step.value;

            if (member.user) {
              clientState.updateUserReference(member.user, this.cid);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this.state.membership = state.membership || {};
      var messages = state.messages || [];

      if (!this.state.messages) {
        this.state.messages = [];
      }

      this.state.addMessagesSorted(messages, false, true);

      if (!this.state.pinnedMessages) {
        this.state.pinnedMessages = [];
      }

      this.state.addPinnedMessages(state.pinned_messages || []);
      this.state.watcher_count = state.watcher_count || 0; // convert the arrays into objects for easier syncing...

      if (state.watchers) {
        var _iterator2 = _createForOfIteratorHelper$2(state.watchers),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var watcher = _step2.value;

            if (watcher) {
              clientState.updateUserReference(watcher, this.cid);
              this.state.watchers[watcher.id] = watcher;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } // initialize read state to last message or current time if the channel is empty
      // if the user is a member, this value will be overwritten later on otherwise this ensures
      // that everything up to this point is not marked as unread


      if (userID != null) {
        var last_read = this.state.last_message_at || new Date();

        if (user) {
          this.state.read[user.id] = {
            user: user,
            last_read: last_read
          };
        }
      } // apply read state if part of the state


      if (state.read) {
        var _iterator3 = _createForOfIteratorHelper$2(state.read),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var read = _step3.value;

            var parsedRead = _objectSpread$5(_objectSpread$5({}, read), {}, {
              last_read: new Date(read.last_read)
            });

            this.state.read[read.user.id] = parsedRead;

            if (read.user.id === (user === null || user === void 0 ? void 0 : user.id) && typeof parsedRead.unread_messages === 'number') {
              this.state.unreadCount = parsedRead.unread_messages;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      if (state.members) {
        var _iterator4 = _createForOfIteratorHelper$2(state.members),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _member = _step4.value;

            if (_member.user) {
              this.state.members[_member.user.id] = _member;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "_disconnect",
    value: function _disconnect() {
      this._client.logger('info', "channel:disconnect() - Disconnecting the channel ".concat(this.cid), {
        tags: ['connection', 'channel'],
        channel: this
      });

      this.disconnected = true;
      this.state.setIsUpToDate(false);
    }
  }]);

  return Channel;
}();

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * ClientState - A container class for the client state.
 */
var ClientState = /*#__PURE__*/function () {
  function ClientState() {
    _classCallCheck__default['default'](this, ClientState);

    _defineProperty__default['default'](this, "users", void 0);

    _defineProperty__default['default'](this, "userChannelReferences", void 0);

    // show the status for a certain user...
    // ie online, offline etc
    this.users = {}; // store which channels contain references to the specified user...

    this.userChannelReferences = {};
  }

  _createClass__default['default'](ClientState, [{
    key: "updateUsers",
    value: function updateUsers(users) {
      var _iterator = _createForOfIteratorHelper$1(users),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var user = _step.value;
          this.updateUser(user);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "updateUser",
    value: function updateUser(user) {
      if (user != null) {
        this.users[user.id] = user;
      }
    }
  }, {
    key: "updateUserReference",
    value: function updateUserReference(user, channelID) {
      if (user == null) {
        return;
      }

      this.updateUser(user);

      if (!this.userChannelReferences[user.id]) {
        this.userChannelReferences[user.id] = {};
      }

      this.userChannelReferences[user.id][channelID] = true;
    }
  }, {
    key: "deleteAllChannelReference",
    value: function deleteAllChannelReference(channelID) {
      for (var userID in this.userChannelReferences) {
        delete this.userChannelReferences[userID][channelID];
      }
    }
  }]);

  return ClientState;
}();

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var InsightMetrics = function InsightMetrics() {
  _classCallCheck__default['default'](this, InsightMetrics);

  _defineProperty__default['default'](this, "connectionStartTimestamp", void 0);

  _defineProperty__default['default'](this, "wsConsecutiveFailures", void 0);

  _defineProperty__default['default'](this, "wsTotalFailures", void 0);

  _defineProperty__default['default'](this, "instanceClientId", void 0);

  this.connectionStartTimestamp = null;
  this.wsTotalFailures = 0;
  this.wsConsecutiveFailures = 0;
  this.instanceClientId = randomId();
};
/**
 * postInsights is not supposed to be used by end users directly within chat application, and thus is kept isolated
 * from all the client/connection code/logic.
 *
 * @param insightType
 * @param insights
 */

var postInsights = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(insightType, insights) {
    var maxAttempts, i;
    return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            maxAttempts = 3;
            i = 0;

          case 2:
            if (!(i < maxAttempts)) {
              _context.next = 17;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return axios__default['default'].post("https://chat-insights.getstream.io/insights/".concat(insightType), insights);

          case 6:
            _context.next = 13;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            _context.next = 12;
            return sleep((i + 1) * 3000);

          case 12:
            return _context.abrupt("continue", 14);

          case 13:
            return _context.abrupt("break", 17);

          case 14:
            i++;
            _context.next = 2;
            break;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 8]]);
  }));

  return function postInsights(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
function buildWsFatalInsight(connection, event) {
  return _objectSpread$4(_objectSpread$4({}, event), buildWsBaseInsight(connection));
}

function buildWsBaseInsight(connection) {
  var _connection$ws, _navigator, _navigator2;

  var client = connection.client;
  return {
    ready_state: (_connection$ws = connection.ws) === null || _connection$ws === void 0 ? void 0 : _connection$ws.readyState,
    url: connection._buildUrl(),
    api_key: client.key,
    start_ts: client.insightMetrics.connectionStartTimestamp,
    end_ts: new Date().getTime(),
    auth_type: client.getAuthType(),
    token: client.tokenManager.token,
    user_id: client.userID,
    user_details: client._user,
    device: client.options.device,
    client_id: connection.connectionID,
    ws_details: connection.ws,
    ws_consecutive_failures: client.insightMetrics.wsConsecutiveFailures,
    ws_total_failures: client.insightMetrics.wsTotalFailures,
    request_id: connection.requestID,
    online: typeof navigator !== 'undefined' ? (_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.onLine : null,
    user_agent: typeof navigator !== 'undefined' ? (_navigator2 = navigator) === null || _navigator2 === void 0 ? void 0 : _navigator2.userAgent : null,
    instance_client_id: client.insightMetrics.instanceClientId
  };
}

function buildWsSuccessAfterFailureInsight(connection) {
  return buildWsBaseInsight(connection);
}

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Type guards to check WebSocket error type
var isCloseEvent = function isCloseEvent(res) {
  return res.code !== undefined;
};

var isErrorEvent = function isErrorEvent(res) {
  return res.error !== undefined;
};
/**
 * StableWSConnection - A WS connection that reconnects upon failure.
 * - the browser will sometimes report that you're online or offline
 * - the WS connection can break and fail (there is a 30s health check)
 * - sometimes your WS connection will seem to work while the user is in fact offline
 * - to speed up online/offline detection you can use the window.addEventListener('offline');
 *
 * There are 4 ways in which a connection can become unhealthy:
 * - websocket.onerror is called
 * - websocket.onclose is called
 * - the health check fails and no event is received for ~40 seconds
 * - the browser indicates the connection is now offline
 *
 * There are 2 assumptions we make about the server:
 * - state can be recovered by querying the channel again
 * - if the servers fails to publish a message to the client, the WS connection is destroyed
 */


var StableWSConnection = /*#__PURE__*/function () {
  // global from constructor
  // local vars
  function StableWSConnection(_ref) {
    var _this = this;

    var client = _ref.client;

    _classCallCheck__default['default'](this, StableWSConnection);

    _defineProperty__default['default'](this, "client", void 0);

    _defineProperty__default['default'](this, "connectionID", void 0);

    _defineProperty__default['default'](this, "connectionOpen", void 0);

    _defineProperty__default['default'](this, "consecutiveFailures", void 0);

    _defineProperty__default['default'](this, "pingInterval", void 0);

    _defineProperty__default['default'](this, "healthCheckTimeoutRef", void 0);

    _defineProperty__default['default'](this, "isConnecting", void 0);

    _defineProperty__default['default'](this, "isDisconnected", void 0);

    _defineProperty__default['default'](this, "isHealthy", void 0);

    _defineProperty__default['default'](this, "isResolved", void 0);

    _defineProperty__default['default'](this, "lastEvent", void 0);

    _defineProperty__default['default'](this, "connectionCheckTimeout", void 0);

    _defineProperty__default['default'](this, "connectionCheckTimeoutRef", void 0);

    _defineProperty__default['default'](this, "rejectPromise", void 0);

    _defineProperty__default['default'](this, "requestID", void 0);

    _defineProperty__default['default'](this, "resolvePromise", void 0);

    _defineProperty__default['default'](this, "totalFailures", void 0);

    _defineProperty__default['default'](this, "ws", void 0);

    _defineProperty__default['default'](this, "wsID", void 0);

    _defineProperty__default['default'](this, "_buildUrl", function () {
      var qs = encodeURIComponent(_this.client._buildWSPayload(_this.requestID));

      var token = _this.client.tokenManager.getToken();

      return "".concat(_this.client.wsBaseURL, "/connect?json=").concat(qs, "&api_key=").concat(_this.client.key, "&authorization=").concat(token, "&stream-auth-type=").concat(_this.client.getAuthType(), "&X-Stream-Client=").concat(_this.client.getUserAgent());
    });

    _defineProperty__default['default'](this, "onlineStatusChanged", function (event) {
      if (event.type === 'offline') {
        // mark the connection as down
        _this._log('onlineStatusChanged() - Status changing to offline');

        _this._setHealth(false);
      } else if (event.type === 'online') {
        // retry right now...
        // We check this.isHealthy, not sure if it's always
        // smart to create a new WS connection if the old one is still up and running.
        // it's possible we didn't miss any messages, so this process is just expensive and not needed.
        _this._log("onlineStatusChanged() - Status changing to online. isHealthy: ".concat(_this.isHealthy));

        if (!_this.isHealthy) {
          _this._reconnect({
            interval: 10
          });
        }
      }
    });

    _defineProperty__default['default'](this, "onopen", function (wsID) {
      if (_this.wsID !== wsID) return;

      _this._log('onopen() - onopen callback', {
        wsID: wsID
      });
    });

    _defineProperty__default['default'](this, "onmessage", function (wsID, event) {
      if (_this.wsID !== wsID) return;
      var data = typeof event.data === 'string' ? JSON.parse(event.data) : null; // we wait till the first message before we consider the connection open..
      // the reason for this is that auth errors and similar errors trigger a ws.onopen and immediately
      // after that a ws.onclose..

      if (!_this.isResolved && data) {
        var _this$resolvePromise;

        _this.isResolved = true;

        if (data.error) {
          var _this$rejectPromise;

          (_this$rejectPromise = _this.rejectPromise) === null || _this$rejectPromise === void 0 ? void 0 : _this$rejectPromise.call(_this, _this._errorFromWSEvent(data, false));
          return;
        }

        (_this$resolvePromise = _this.resolvePromise) === null || _this$resolvePromise === void 0 ? void 0 : _this$resolvePromise.call(_this, data);

        _this._setHealth(true);
      } // trigger the event..


      _this.lastEvent = new Date();

      _this._log('onmessage() - onmessage callback', {
        event: event,
        wsID: wsID
      });

      if (data && data.type === 'health.check') {
        _this.scheduleNextPing();
      }

      _this.client.handleEvent(event);

      _this.scheduleConnectionCheck();
    });

    _defineProperty__default['default'](this, "onclose", function (wsID, event) {
      if (_this.wsID !== wsID) return;

      _this._log('onclose() - onclose callback - ' + event.code, {
        event: event,
        wsID: wsID
      });

      if (event.code === chatCodes.WS_CLOSED_SUCCESS) {
        var _this$rejectPromise2;

        // this is a permanent error raised by stream..
        // usually caused by invalid auth details
        var error = new Error("WS connection reject with error ".concat(event.reason));
        error.reason = event.reason;
        error.code = event.code;
        error.wasClean = event.wasClean;
        error.target = event.target;
        (_this$rejectPromise2 = _this.rejectPromise) === null || _this$rejectPromise2 === void 0 ? void 0 : _this$rejectPromise2.call(_this, error);

        _this._log("onclose() - WS connection reject with error ".concat(event.reason), {
          event: event
        });
      } else {
        var _this$rejectPromise3;

        _this.consecutiveFailures += 1;
        _this.totalFailures += 1;

        _this._setHealth(false);

        _this.isConnecting = false;
        (_this$rejectPromise3 = _this.rejectPromise) === null || _this$rejectPromise3 === void 0 ? void 0 : _this$rejectPromise3.call(_this, _this._errorFromWSEvent(event));

        _this._log("onclose() - WS connection closed. Calling reconnect ...", {
          event: event
        }); // reconnect if its an abnormal failure


        _this._reconnect();
      }
    });

    _defineProperty__default['default'](this, "onerror", function (wsID, event) {
      var _this$rejectPromise4;

      if (_this.wsID !== wsID) return;
      _this.consecutiveFailures += 1;
      _this.totalFailures += 1;

      _this._setHealth(false);

      _this.isConnecting = false;
      (_this$rejectPromise4 = _this.rejectPromise) === null || _this$rejectPromise4 === void 0 ? void 0 : _this$rejectPromise4.call(_this, _this._errorFromWSEvent(event));

      _this._log("onerror() - WS connection resulted into error", {
        event: event
      });

      _this._reconnect();
    });

    _defineProperty__default['default'](this, "_setHealth", function (healthy) {
      if (healthy === _this.isHealthy) return;
      _this.isHealthy = healthy;

      if (_this.isHealthy) {
        //@ts-expect-error
        _this.client.dispatchEvent({
          type: 'connection.changed',
          online: _this.isHealthy
        });

        return;
      } // we're offline, wait few seconds and fire and event if still offline


      setTimeout(function () {
        if (_this.isHealthy) return; //@ts-expect-error

        _this.client.dispatchEvent({
          type: 'connection.changed',
          online: _this.isHealthy
        });
      }, 5000);
    });

    _defineProperty__default['default'](this, "_errorFromWSEvent", function (event) {
      var isWSFailure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var code;
      var statusCode;
      var message;

      if (isCloseEvent(event)) {
        code = event.code;
        statusCode = 'unknown';
        message = event.reason;
      }

      if (isErrorEvent(event)) {
        code = event.error.code;
        statusCode = event.error.StatusCode;
        message = event.error.message;
      } // Keeping this `warn` level log, to avoid cluttering of error logs from ws failures.


      _this._log("_errorFromWSEvent() - WS failed with code ".concat(code), {
        event: event
      }, 'warn');

      var error = new Error("WS failed with code ".concat(code, " and reason - ").concat(message));
      error.code = code;
      /**
       * StatusCode does not exist on any event types but has been left
       * as is to preserve JS functionality during the TS implementation
       */

      error.StatusCode = statusCode;
      error.isWSFailure = isWSFailure;
      return error;
    });

    _defineProperty__default['default'](this, "_setupConnectionPromise", function () {
      _this.isResolved = false;
      /** a promise that is resolved once ws.open is called */

      _this.connectionOpen = new Promise(function (resolve, reject) {
        _this.resolvePromise = resolve;
        _this.rejectPromise = reject;
      });
    });

    _defineProperty__default['default'](this, "scheduleNextPing", function () {
      if (_this.healthCheckTimeoutRef) {
        clearTimeout(_this.healthCheckTimeoutRef);
      } // 30 seconds is the recommended interval (messenger uses this)


      _this.healthCheckTimeoutRef = setTimeout(function () {
        // send the healthcheck.., server replies with a health check event
        var data = [{
          type: 'health.check',
          client_id: _this.client.clientID
        }]; // try to send on the connection

        try {
          var _this$ws;

          (_this$ws = _this.ws) === null || _this$ws === void 0 ? void 0 : _this$ws.send(JSON.stringify(data));
        } catch (e) {// error will already be detected elsewhere
        }
      }, _this.pingInterval);
    });

    _defineProperty__default['default'](this, "scheduleConnectionCheck", function () {
      if (_this.connectionCheckTimeoutRef) {
        clearTimeout(_this.connectionCheckTimeoutRef);
      }

      _this.connectionCheckTimeoutRef = setTimeout(function () {
        var now = new Date();

        if (_this.lastEvent && now.getTime() - _this.lastEvent.getTime() > _this.connectionCheckTimeout) {
          _this._log('scheduleConnectionCheck - going to reconnect');

          _this._setHealth(false);

          _this._reconnect();
        }
      }, _this.connectionCheckTimeout);
    });

    /** StreamChat client */
    this.client = client;
    /** consecutive failures influence the duration of the timeout */

    this.consecutiveFailures = 0;
    /** keep track of the total number of failures */

    this.totalFailures = 0;
    /** We only make 1 attempt to reconnect at the same time.. */

    this.isConnecting = false;
    /** To avoid reconnect if client is disconnected */

    this.isDisconnected = false;
    /** Boolean that indicates if the connection promise is resolved */

    this.isResolved = false;
    /** Boolean that indicates if we have a working connection to the server */

    this.isHealthy = false;
    /** Incremented when a new WS connection is made */

    this.wsID = 1;
    /** Store the last event time for health checks */

    this.lastEvent = null;
    /** Send a health check message every 25 seconds */

    this.pingInterval = 25 * 1000;
    this.connectionCheckTimeout = this.pingInterval + 10 * 1000;
    addConnectionEventListeners(this.onlineStatusChanged);
  }

  _createClass__default['default'](StableWSConnection, [{
    key: "_log",
    value: function _log(msg) {
      var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'info';
      this.client.logger(level, 'connection:' + msg, _objectSpread$3({
        tags: ['connection']
      }, extra));
    }
    /**
     * connect - Connect to the WS URL
     * the default 15s timeout allows between 2~3 tries
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Promise that completes once the first health check message is received
     */

  }, {
    key: "connect",
    value: function () {
      var _connect2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee() {
        var timeout,
            healthCheck,
            _args = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                timeout = _args.length > 0 && _args[0] !== undefined ? _args[0] : 15000;

                if (!this.isConnecting) {
                  _context.next = 3;
                  break;
                }

                throw Error("You've called connect twice, can only attempt 1 connection at the time");

              case 3:
                this.isDisconnected = false;
                _context.prev = 4;
                _context.next = 7;
                return this._connect();

              case 7:
                healthCheck = _context.sent;
                this.consecutiveFailures = 0;

                this._log("connect() - Established ws connection with healthcheck: ".concat(healthCheck));

                _context.next = 23;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](4);
                this.isHealthy = false;
                this.consecutiveFailures += 1;

                if (!(_context.t0.code === chatCodes.TOKEN_EXPIRED && !this.client.tokenManager.isStatic())) {
                  _context.next = 21;
                  break;
                }

                this._log('connect() - WS failure due to expired token, so going to try to reload token and reconnect');

                this._reconnect({
                  refreshToken: true
                });

                _context.next = 23;
                break;

              case 21:
                if (_context.t0.isWSFailure) {
                  _context.next = 23;
                  break;
                }

                throw new Error(JSON.stringify({
                  code: _context.t0.code,
                  StatusCode: _context.t0.StatusCode,
                  message: _context.t0.message,
                  isWSFailure: _context.t0.isWSFailure
                }));

              case 23:
                _context.next = 25;
                return this._waitForHealthy(timeout);

              case 25:
                return _context.abrupt("return", _context.sent);

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 12]]);
      }));

      function connect() {
        return _connect2.apply(this, arguments);
      }

      return connect;
    }()
    /**
     * _waitForHealthy polls the promise connection to see if its resolved until it times out
     * the default 15s timeout allows between 2~3 tries
     * @param timeout duration(ms)
     */

  }, {
    key: "_waitForHealthy",
    value: function () {
      var _waitForHealthy2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee4() {
        var _this2 = this;

        var timeout,
            _args4 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                timeout = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 15000;
                return _context4.abrupt("return", Promise.race([_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2() {
                  var interval, i;
                  return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          interval = 50; // ms

                          i = 0;

                        case 2:
                          if (!(i <= timeout)) {
                            _context2.next = 18;
                            break;
                          }

                          _context2.prev = 3;
                          _context2.next = 6;
                          return _this2.connectionOpen;

                        case 6:
                          return _context2.abrupt("return", _context2.sent);

                        case 9:
                          _context2.prev = 9;
                          _context2.t0 = _context2["catch"](3);

                          if (!(i === timeout)) {
                            _context2.next = 13;
                            break;
                          }

                          throw new Error(JSON.stringify({
                            code: _context2.t0.code,
                            StatusCode: _context2.t0.StatusCode,
                            message: _context2.t0.message,
                            isWSFailure: _context2.t0.isWSFailure
                          }));

                        case 13:
                          _context2.next = 15;
                          return sleep(interval);

                        case 15:
                          i += interval;
                          _context2.next = 2;
                          break;

                        case 18:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[3, 9]]);
                }))(), _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee3() {
                  return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return sleep(timeout);

                        case 2:
                          _this2.isConnecting = false;
                          throw new Error(JSON.stringify({
                            code: '',
                            StatusCode: '',
                            message: 'initial WS connection could not be established',
                            isWSFailure: true
                          }));

                        case 4:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }))()]));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function _waitForHealthy() {
        return _waitForHealthy2.apply(this, arguments);
      }

      return _waitForHealthy;
    }()
    /**
     * Builds and returns the url for websocket.
     * @private
     * @returns url string
     */

  }, {
    key: "disconnect",
    value:
    /**
     * disconnect - Disconnect the connection and doesn't recover...
     *
     */
    function disconnect(timeout) {
      var _this3 = this;

      this._log("disconnect() - Closing the websocket connection for wsID ".concat(this.wsID));

      this.wsID += 1;
      this.isConnecting = false;
      this.isDisconnected = true; // start by removing all the listeners

      if (this.healthCheckTimeoutRef) {
        clearInterval(this.healthCheckTimeoutRef);
      }

      if (this.connectionCheckTimeoutRef) {
        clearInterval(this.connectionCheckTimeoutRef);
      }

      removeConnectionEventListeners(this.onlineStatusChanged);
      this.isHealthy = false; // remove ws handlers...

      if (this.ws && this.ws.removeAllListeners) {
        this.ws.removeAllListeners();
      }

      var isClosedPromise; // and finally close...
      // Assigning to local here because we will remove it from this before the
      // promise resolves.

      var ws = this.ws;

      if (ws && ws.close && ws.readyState === ws.OPEN) {
        isClosedPromise = new Promise(function (resolve) {
          var onclose = function onclose(event) {
            _this3._log("disconnect() - resolving isClosedPromise ".concat(event ? 'with' : 'without', " close frame"), {
              event: event
            });

            resolve();
          };

          ws.onclose = onclose; // In case we don't receive close frame websocket server in time,
          // lets not wait for more than 1 seconds.

          setTimeout(onclose, timeout != null ? timeout : 1000);
        });

        this._log("disconnect() - Manually closed connection by calling client.disconnect()");

        ws.close(chatCodes.WS_CLOSED_SUCCESS, 'Manually closed connection by calling client.disconnect()');
      } else {
        this._log("disconnect() - ws connection doesn't exist or it is already closed.");

        isClosedPromise = Promise.resolve();
      }

      delete this.ws;
      return isClosedPromise;
    }
    /**
     * _connect - Connect to the WS endpoint
     *
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Promise that completes once the first health check message is received
     */

  }, {
    key: "_connect",
    value: function () {
      var _connect3 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee5() {
        var wsURL, response, insights;
        return _regeneratorRuntime__default['default'].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.isConnecting || this.isDisconnected)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return");

              case 2:
                // simply ignore _connect if it's currently trying to connect
                this.isConnecting = true;
                this.requestID = randomId();
                this.client.insightMetrics.connectionStartTimestamp = new Date().getTime();
                _context5.prev = 5;
                _context5.next = 8;
                return this.client.tokenManager.tokenReady();

              case 8:
                this._setupConnectionPromise();

                wsURL = this._buildUrl();
                this.ws = new WebSocket__default['default'](wsURL);
                this.ws.onopen = this.onopen.bind(this, this.wsID);
                this.ws.onclose = this.onclose.bind(this, this.wsID);
                this.ws.onerror = this.onerror.bind(this, this.wsID);
                this.ws.onmessage = this.onmessage.bind(this, this.wsID);
                _context5.next = 17;
                return this.connectionOpen;

              case 17:
                response = _context5.sent;
                this.isConnecting = false;

                if (!response) {
                  _context5.next = 23;
                  break;
                }

                this.connectionID = response.connection_id;

                if (this.client.insightMetrics.wsConsecutiveFailures > 0 && this.client.options.enableInsights) {
                  postInsights('ws_success_after_failure', buildWsSuccessAfterFailureInsight(this));
                  this.client.insightMetrics.wsConsecutiveFailures = 0;
                }

                return _context5.abrupt("return", response);

              case 23:
                _context5.next = 30;
                break;

              case 25:
                _context5.prev = 25;
                _context5.t0 = _context5["catch"](5);
                this.isConnecting = false;

                if (this.client.options.enableInsights) {
                  this.client.insightMetrics.wsConsecutiveFailures++;
                  this.client.insightMetrics.wsTotalFailures++;
                  insights = buildWsFatalInsight(this, convertErrorToJson(_context5.t0));
                  postInsights === null || postInsights === void 0 ? void 0 : postInsights('ws_fatal', insights);
                }

                throw _context5.t0;

              case 30:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[5, 25]]);
      }));

      function _connect() {
        return _connect3.apply(this, arguments);
      }

      return _connect;
    }()
    /**
     * _reconnect - Retry the connection to WS endpoint
     *
     * @param {{ interval?: number; refreshToken?: boolean }} options Following options are available
     *
     * - `interval`	{int}			number of ms that function should wait before reconnecting
     * - `refreshToken` {boolean}	reload/refresh user token be refreshed before attempting reconnection.
     */

  }, {
    key: "_reconnect",
    value: function () {
      var _reconnect2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee6() {
        var options,
            interval,
            _args6 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};

                this._log('_reconnect() - Initiating the reconnect'); // only allow 1 connection at the time


                if (!(this.isConnecting || this.isHealthy)) {
                  _context6.next = 5;
                  break;
                }

                this._log('_reconnect() - Abort (1) since already connecting or healthy');

                return _context6.abrupt("return");

              case 5:
                // reconnect in case of on error or on close
                // also reconnect if the health check cycle fails
                interval = options.interval;

                if (!interval) {
                  interval = retryInterval(this.consecutiveFailures);
                } // reconnect, or try again after a little while...


                _context6.next = 9;
                return sleep(interval);

              case 9:
                if (!(this.isConnecting || this.isHealthy)) {
                  _context6.next = 12;
                  break;
                }

                this._log('_reconnect() - Abort (2) since already connecting or healthy');

                return _context6.abrupt("return");

              case 12:
                if (!this.isDisconnected) {
                  _context6.next = 15;
                  break;
                }

                this._log('_reconnect() - Abort (3) since disconnect() is called');

                return _context6.abrupt("return");

              case 15:
                this._log('_reconnect() - Destroying current WS connection'); // cleanup the old connection


                this._destroyCurrentWSConnection();

                if (!options.refreshToken) {
                  _context6.next = 20;
                  break;
                }

                _context6.next = 20;
                return this.client.tokenManager.loadToken();

              case 20:
                _context6.prev = 20;
                _context6.next = 23;
                return this._connect();

              case 23:
                this._log('_reconnect() - Waiting for recoverCallBack');

                _context6.next = 26;
                return this.client.recoverState();

              case 26:
                this._log('_reconnect() - Finished recoverCallBack');

                this.consecutiveFailures = 0;
                _context6.next = 38;
                break;

              case 30:
                _context6.prev = 30;
                _context6.t0 = _context6["catch"](20);
                this.isHealthy = false;
                this.consecutiveFailures += 1;

                if (!(_context6.t0.code === chatCodes.TOKEN_EXPIRED && !this.client.tokenManager.isStatic())) {
                  _context6.next = 37;
                  break;
                }

                this._log('_reconnect() - WS failure due to expired token, so going to try to reload token and reconnect');

                return _context6.abrupt("return", this._reconnect({
                  refreshToken: true
                }));

              case 37:
                // reconnect on WS failures, don't reconnect if there is a code bug
                if (_context6.t0.isWSFailure) {
                  this._log('_reconnect() - WS failure, so going to try to reconnect');

                  this._reconnect();
                }

              case 38:
                this._log('_reconnect() - == END ==');

              case 39:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[20, 30]]);
      }));

      function _reconnect() {
        return _reconnect2.apply(this, arguments);
      }

      return _reconnect;
    }()
    /**
     * onlineStatusChanged - this function is called when the browser connects or disconnects from the internet.
     *
     * @param {Event} event Event with type online or offline
     *
     */

  }, {
    key: "_destroyCurrentWSConnection",
    value:
    /**
     * _destroyCurrentWSConnection - Removes the current WS connection
     *
     */
    function _destroyCurrentWSConnection() {
      // increment the ID, meaning we will ignore all messages from the old
      // ws connection from now on.
      this.wsID += 1;

      try {
        var _this$ws2, _this$ws3;

        this === null || this === void 0 ? void 0 : (_this$ws2 = this.ws) === null || _this$ws2 === void 0 ? void 0 : _this$ws2.removeAllListeners();
        this === null || this === void 0 ? void 0 : (_this$ws3 = this.ws) === null || _this$ws3 === void 0 ? void 0 : _this$ws3.close();
      } catch (e) {// we don't care
      }
    }
    /**
     * _setupPromise - sets up the this.connectOpen promise
     */

  }]);

  return StableWSConnection;
}();

var jwt = null;

var crypto$1 = null;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Creates the JWT token that can be used for a UserSession
 * @method JWTUserToken
 * @memberof signing
 * @private
 * @param {Secret} apiSecret - API Secret key
 * @param {string} userId - The user_id key in the JWT payload
 * @param {UR} [extraData] - Extra that should be part of the JWT token
 * @param {SignOptions} [jwtOptions] - Options that can be past to jwt.sign
 * @return {string} JWT Token
 */
function JWTUserToken(apiSecret, userId) {
  var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var jwtOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (typeof userId !== 'string') {
    throw new TypeError('userId should be a string');
  }

  var payload = _objectSpread$2({
    user_id: userId
  }, extraData); // make sure we return a clear error when jwt is shimmed (ie. browser build)


  {
    throw Error("Unable to find jwt crypto, if you are getting this error is probably because you are trying to generate tokens on browser or React Native (or other environment where crypto functions are not available). Please Note: token should only be generated server-side.");
  }

  var opts = _extends__default['default']({
    algorithm: 'HS256',
    noTimestamp: true
  }, jwtOptions);
}
function JWTServerToken(apiSecret) {
  var jwtOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var payload = {
    server: true
  };

  var opts = _extends__default['default']({
    algorithm: 'HS256',
    noTimestamp: true
  }, jwtOptions);

  return jwt.sign(payload, apiSecret, opts);
}
function UserFromToken(token) {
  var fragments = token.split('.');

  if (fragments.length !== 3) {
    return '';
  }

  var b64Payload = fragments[1];
  var payload = decodeBase64(b64Payload);
  var data = JSON.parse(payload);
  return data.user_id;
}
/**
 *
 * @param {string} userId the id of the user
 * @return {string}
 */

function DevToken(userId) {
  return ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', //{"alg": "HS256", "typ": "JWT"}
  encodeBase64(JSON.stringify({
    user_id: userId
  })), 'devtoken' // hardcoded signature
  ].join('.');
}
/**
 *
 * @param {string} body the signed message
 * @param {string} secret the shared secret used to generate the signature (Stream API secret)
 * @param {string} signature the signature to validate
 * @return {boolean}
 */

function CheckSignature(body, secret, signature) {
  var key = Buffer.from(secret, 'ascii');
  var hash = crypto$1.createHmac('sha256', key).update(body).digest('hex');
  return hash === signature;
}

/**
 * TokenManager
 *
 * Handles all the operations around user token.
 */
var TokenManager =
/**
 * Constructor
 *
 * @param {Secret} secret
 */
function TokenManager(secret) {
  var _this = this;

  _classCallCheck__default['default'](this, TokenManager);

  _defineProperty__default['default'](this, "loadTokenPromise", void 0);

  _defineProperty__default['default'](this, "type", void 0);

  _defineProperty__default['default'](this, "secret", void 0);

  _defineProperty__default['default'](this, "token", void 0);

  _defineProperty__default['default'](this, "tokenProvider", void 0);

  _defineProperty__default['default'](this, "user", void 0);

  _defineProperty__default['default'](this, "setTokenOrProvider", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(tokenOrProvider, user) {
      return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.validateToken(tokenOrProvider, user);

              _this.user = user;

              if (isFunction(tokenOrProvider)) {
                _this.tokenProvider = tokenOrProvider;
                _this.type = 'provider';
              }

              if (typeof tokenOrProvider === 'string') {
                _this.token = tokenOrProvider;
                _this.type = 'static';
              }

              if (!tokenOrProvider && _this.user && _this.secret) {
                _this.token = JWTUserToken(_this.secret, user.id, {}, {});
                _this.type = 'static';
              }

              _context.next = 7;
              return _this.loadToken();

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  _defineProperty__default['default'](this, "reset", function () {
    _this.token = undefined;
    _this.user = undefined;
    _this.loadTokenPromise = null;
  });

  _defineProperty__default['default'](this, "validateToken", function (tokenOrProvider, user) {
    // allow empty token for anon user
    if (user && user.anon && !tokenOrProvider) return; // Don't allow empty token for non-server side client.

    if (!_this.secret && !tokenOrProvider) {
      throw new Error('User token can not be empty');
    }

    if (tokenOrProvider && typeof tokenOrProvider !== 'string' && !isFunction(tokenOrProvider)) {
      throw new Error('user token should either be a string or a function');
    }

    if (typeof tokenOrProvider === 'string') {
      // Allow empty token for anonymous users
      if (user.anon && tokenOrProvider === '') return;
      var tokenUserId = UserFromToken(tokenOrProvider);

      if (tokenOrProvider != null && (tokenUserId == null || tokenUserId === '' || tokenUserId !== user.id)) {
        throw new Error('userToken does not have a user_id or is not matching with user.id');
      }
    }
  });

  _defineProperty__default['default'](this, "tokenReady", function () {
    return _this.loadTokenPromise;
  });

  _defineProperty__default['default'](this, "loadToken", function () {
    // eslint-disable-next-line no-async-promise-executor
    _this.loadTokenPromise = new Promise( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2(resolve) {
        return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(_this.type === 'static')) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", resolve(_this.token));

              case 2:
                if (!(_this.tokenProvider && typeof _this.tokenProvider !== 'string')) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 5;
                return _this.tokenProvider();

              case 5:
                _this.token = _context2.sent;
                resolve(_this.token);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
    return _this.loadTokenPromise;
  });

  _defineProperty__default['default'](this, "getToken", function () {
    if (_this.token) {
      return _this.token;
    }

    if (_this.user && _this.user.anon && !_this.token) {
      return _this.token;
    }

    if (_this.secret) {
      return JWTServerToken(_this.secret);
    }

    throw new Error("Both secret and user tokens are not set. Either client.connectUser wasn't called or client.disconnect was called");
  });

  _defineProperty__default['default'](this, "isStatic", function () {
    return _this.type === 'static';
  });

  this.loadTokenPromise = null;

  if (secret) {
    this.secret = secret;
  }

  this.type = 'static';

  if (this.secret) {
    this.token = JWTServerToken(this.secret);
  }
}
/**
 * Set the static string token or token provider.
 * Token provider should return a token string or a promise which resolves to string token.
 *
 * @param {TokenOrProvider} tokenOrProvider
 * @param {UserResponse<UserType>} user
 */
;

var APIErrorCodes = {
  '-1': {
    name: 'InternalSystemError',
    retryable: true
  },
  '2': {
    name: 'AccessKeyError',
    retryable: false
  },
  '3': {
    name: 'AuthenticationFailedError',
    retryable: true
  },
  '4': {
    name: 'InputError',
    retryable: false
  },
  '6': {
    name: 'DuplicateUsernameError',
    retryable: false
  },
  '9': {
    name: 'RateLimitError',
    retryable: true
  },
  '16': {
    name: 'DoesNotExistError',
    retryable: false
  },
  '17': {
    name: 'NotAllowedError',
    retryable: false
  },
  '18': {
    name: 'EventNotSupportedError',
    retryable: false
  },
  '19': {
    name: 'ChannelFeatureNotSupportedError',
    retryable: false
  },
  '20': {
    name: 'MessageTooLongError',
    retryable: false
  },
  '21': {
    name: 'MultipleNestingLevelError',
    retryable: false
  },
  '22': {
    name: 'PayloadTooBigError',
    retryable: false
  },
  '23': {
    name: 'RequestTimeoutError',
    retryable: true
  },
  '24': {
    name: 'MaxHeaderSizeExceededError',
    retryable: false
  },
  '40': {
    name: 'AuthErrorTokenExpired',
    retryable: false
  },
  '41': {
    name: 'AuthErrorTokenNotValidYet',
    retryable: false
  },
  '42': {
    name: 'AuthErrorTokenUsedBeforeIssuedAt',
    retryable: false
  },
  '43': {
    name: 'AuthErrorTokenSignatureInvalid',
    retryable: false
  },
  '44': {
    name: 'CustomCommandEndpointMissingError',
    retryable: false
  },
  '45': {
    name: 'CustomCommandEndpointCallError',
    retryable: true
  },
  '46': {
    name: 'ConnectionIDNotFoundError',
    retryable: false
  },
  '60': {
    name: 'CoolDownError',
    retryable: true
  },
  '69': {
    name: 'ErrWrongRegion',
    retryable: false
  },
  '70': {
    name: 'ErrQueryChannelPermissions',
    retryable: false
  },
  '71': {
    name: 'ErrTooManyConnections',
    retryable: true
  },
  '99': {
    name: 'AppSuspendedError',
    retryable: false
  }
};
function isAPIError(error) {
  return error.code !== undefined;
}
function isErrorRetryable(error) {
  if (!error.code) return false;
  var err = APIErrorCodes["".concat(error.code)];
  if (!err) return false;
  return err.retryable;
}
function isConnectionIDError(error) {
  return error.code === 46; // ConnectionIDNotFoundError
}
function isWSFailure(err) {
  if (typeof err.isWSFailure === 'boolean') {
    return err.isWSFailure;
  }

  try {
    return JSON.parse(err.message).isWSFailure;
  } catch (_) {
    return false;
  }
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var ConnectionState;

(function (ConnectionState) {
  ConnectionState["Closed"] = "CLOSED";
  ConnectionState["Connected"] = "CONNECTED";
  ConnectionState["Connecting"] = "CONNECTING";
  ConnectionState["Disconnected"] = "DISCONNECTED";
  ConnectionState["Init"] = "INIT";
})(ConnectionState || (ConnectionState = {}));

var WSConnectionFallback = /*#__PURE__*/function () {
  function WSConnectionFallback(_ref) {
    var _this = this;

    var client = _ref.client;

    _classCallCheck__default['default'](this, WSConnectionFallback);

    _defineProperty__default['default'](this, "client", void 0);

    _defineProperty__default['default'](this, "state", void 0);

    _defineProperty__default['default'](this, "consecutiveFailures", void 0);

    _defineProperty__default['default'](this, "connectionID", void 0);

    _defineProperty__default['default'](this, "cancelToken", void 0);

    _defineProperty__default['default'](this, "_onlineStatusChanged", function (event) {
      _this._log("_onlineStatusChanged() - ".concat(event.type));

      if (event.type === 'offline') {
        var _this$cancelToken;

        _this._setState(ConnectionState.Closed);

        (_this$cancelToken = _this.cancelToken) === null || _this$cancelToken === void 0 ? void 0 : _this$cancelToken.cancel('disconnect() is called');
        _this.cancelToken = undefined;
        return;
      }

      if (event.type === 'online' && _this.state === ConnectionState.Closed) {
        _this.connect(true);
      }
    });

    _defineProperty__default['default'](this, "_req", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(params, config, retry) {
        var _this$cancelToken2, res;

        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this.cancelToken && !params.close) {
                  _this.cancelToken = axios__default['default'].CancelToken.source();
                }

                _context.prev = 1;
                _context.next = 4;
                return _this.client.doAxiosRequest('get', _this.client.baseURL.replace(':3030', ':8900') + '/longpoll', // replace port if present for testing with local API
                undefined, {
                  config: _objectSpread$1(_objectSpread$1({}, config), {}, {
                    cancelToken: (_this$cancelToken2 = _this.cancelToken) === null || _this$cancelToken2 === void 0 ? void 0 : _this$cancelToken2.token
                  }),
                  params: params
                });

              case 4:
                res = _context.sent;
                _this.consecutiveFailures = 0; // always reset in case of no error

                return _context.abrupt("return", res);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](1);
                _this.consecutiveFailures += 1;

                if (!(retry && isErrorRetryable(_context.t0))) {
                  _context.next = 17;
                  break;
                }

                _this._log("_req() - Retryable error, retrying request");

                _context.next = 16;
                return sleep(retryInterval(_this.consecutiveFailures));

              case 16:
                return _context.abrupt("return", _this._req(params, config, retry));

              case 17:
                throw _context.t0;

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 9]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "_poll", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2() {
      var _data$events, data, i;

      return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.state === ConnectionState.Connected)) {
                _context2.next = 25;
                break;
              }

              _context2.prev = 1;
              _context2.next = 4;
              return _this._req({}, {
                timeout: 30000
              }, true);

            case 4:
              data = _context2.sent;

              // 30s => API responds in 20s if there is no event
              if ((_data$events = data.events) !== null && _data$events !== void 0 && _data$events.length) {
                for (i = 0; i < data.events.length; i++) {
                  _this.client.dispatchEvent(data.events[i]);
                }
              }

              _context2.next = 23;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);

              if (!axios__default['default'].isCancel(_context2.t0)) {
                _context2.next = 13;
                break;
              }

              _this._log("_poll() - axios canceled request");

              return _context2.abrupt("return");

            case 13:
              if (!isConnectionIDError(_context2.t0)) {
                _context2.next = 18;
                break;
              }

              _this._log("_poll() - ConnectionID error, connecting without ID...");

              _this._setState(ConnectionState.Disconnected);

              _this.connect(true);

              return _context2.abrupt("return");

            case 18:
              if (!(isAPIError(_context2.t0) && !isErrorRetryable(_context2.t0))) {
                _context2.next = 21;
                break;
              }

              _this._setState(ConnectionState.Closed);

              return _context2.abrupt("return");

            case 21:
              _context2.next = 23;
              return sleep(retryInterval(_this.consecutiveFailures));

            case 23:
              _context2.next = 0;
              break;

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    })));

    _defineProperty__default['default'](this, "connect", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee3() {
      var reconnect,
          _yield$_this$_req,
          event,
          _args3 = arguments;

      return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              reconnect = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : false;

              if (!(_this.state === ConnectionState.Connecting)) {
                _context3.next = 4;
                break;
              }

              _this._log('connect() - connecting already in progress', {
                reconnect: reconnect
              }, 'warn');

              return _context3.abrupt("return");

            case 4:
              if (!(_this.state === ConnectionState.Connected)) {
                _context3.next = 7;
                break;
              }

              _this._log('connect() - already connected and polling', {
                reconnect: reconnect
              }, 'warn');

              return _context3.abrupt("return");

            case 7:
              _this._setState(ConnectionState.Connecting);

              _this.connectionID = undefined; // connect should be sent with empty connection_id so API creates one

              _context3.prev = 9;
              _context3.next = 12;
              return _this._req({
                json: _this.client._buildWSPayload()
              }, {
                timeout: 8000
              }, // 8s
              reconnect);

            case 12:
              _yield$_this$_req = _context3.sent;
              event = _yield$_this$_req.event;

              _this._setState(ConnectionState.Connected);

              _this.connectionID = event.connection_id;

              _this._poll();

              if (reconnect) {
                _this.client.recoverState();
              }

              return _context3.abrupt("return", event);

            case 21:
              _context3.prev = 21;
              _context3.t0 = _context3["catch"](9);

              _this._setState(ConnectionState.Closed);

              throw _context3.t0;

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[9, 21]]);
    })));

    _defineProperty__default['default'](this, "isHealthy", function () {
      return !!_this.connectionID && _this.state === ConnectionState.Connected;
    });

    _defineProperty__default['default'](this, "disconnect", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee4() {
      var _this$cancelToken3;

      var timeout,
          connection_id,
          _args4 = arguments;
      return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              timeout = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 2000;
              removeConnectionEventListeners(_this._onlineStatusChanged);

              _this._setState(ConnectionState.Disconnected);

              (_this$cancelToken3 = _this.cancelToken) === null || _this$cancelToken3 === void 0 ? void 0 : _this$cancelToken3.cancel('disconnect() is called');
              _this.cancelToken = undefined;
              connection_id = _this.connectionID;
              _this.connectionID = undefined;
              _context4.prev = 7;
              _context4.next = 10;
              return _this._req({
                close: true,
                connection_id: connection_id
              }, {
                timeout: timeout
              }, false);

            case 10:
              _this._log("disconnect() - Closed connectionID");

              _context4.next = 16;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](7);

              _this._log("disconnect() - Failed", {
                err: _context4.t0
              }, 'error');

            case 16:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[7, 13]]);
    })));

    this.client = client;
    this.state = ConnectionState.Init;
    this.consecutiveFailures = 0;
    addConnectionEventListeners(this._onlineStatusChanged);
  }

  _createClass__default['default'](WSConnectionFallback, [{
    key: "_log",
    value: function _log(msg) {
      var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'info';
      this.client.logger(level, 'WSConnectionFallback:' + msg, _objectSpread$1({
        tags: ['connection_fallback', 'connection']
      }, extra));
    }
  }, {
    key: "_setState",
    value: function _setState(state) {
      this._log("_setState() - ".concat(state)); // transition from connecting => connected


      if (this.state === ConnectionState.Connecting && state === ConnectionState.Connected) {
        //@ts-expect-error
        this.client.dispatchEvent({
          type: 'connection.changed',
          online: true
        });
      }

      if (state === ConnectionState.Closed || state === ConnectionState.Disconnected) {
        //@ts-expect-error
        this.client.dispatchEvent({
          type: 'connection.changed',
          online: false
        });
      }

      this.state = state;
    }
    /** @private */

  }]);

  return WSConnectionFallback;
}();

var _excluded = ["created_at", "updated_at", "last_active", "online"];

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function isString(x) {
  return typeof x === 'string' || x instanceof String;
}

var StreamChat = /*#__PURE__*/function () {
  function StreamChat(_key, secretOrOptions, _options) {
    var _this = this;

    _classCallCheck__default['default'](this, StreamChat);

    _defineProperty__default['default'](this, "_user", void 0);

    _defineProperty__default['default'](this, "activeChannels", void 0);

    _defineProperty__default['default'](this, "anonymous", void 0);

    _defineProperty__default['default'](this, "axiosInstance", void 0);

    _defineProperty__default['default'](this, "baseURL", void 0);

    _defineProperty__default['default'](this, "browser", void 0);

    _defineProperty__default['default'](this, "cleaningIntervalRef", void 0);

    _defineProperty__default['default'](this, "clientID", void 0);

    _defineProperty__default['default'](this, "configs", void 0);

    _defineProperty__default['default'](this, "key", void 0);

    _defineProperty__default['default'](this, "listeners", void 0);

    _defineProperty__default['default'](this, "logger", void 0);

    _defineProperty__default['default'](this, "recoverStateOnReconnect", void 0);

    _defineProperty__default['default'](this, "mutedChannels", void 0);

    _defineProperty__default['default'](this, "mutedUsers", void 0);

    _defineProperty__default['default'](this, "node", void 0);

    _defineProperty__default['default'](this, "options", void 0);

    _defineProperty__default['default'](this, "secret", void 0);

    _defineProperty__default['default'](this, "setUserPromise", void 0);

    _defineProperty__default['default'](this, "state", void 0);

    _defineProperty__default['default'](this, "tokenManager", void 0);

    _defineProperty__default['default'](this, "user", void 0);

    _defineProperty__default['default'](this, "userAgent", void 0);

    _defineProperty__default['default'](this, "userID", void 0);

    _defineProperty__default['default'](this, "wsBaseURL", void 0);

    _defineProperty__default['default'](this, "wsConnection", void 0);

    _defineProperty__default['default'](this, "wsFallback", void 0);

    _defineProperty__default['default'](this, "wsPromise", void 0);

    _defineProperty__default['default'](this, "consecutiveFailures", void 0);

    _defineProperty__default['default'](this, "insightMetrics", void 0);

    _defineProperty__default['default'](this, "defaultWSTimeoutWithFallback", void 0);

    _defineProperty__default['default'](this, "defaultWSTimeout", void 0);

    _defineProperty__default['default'](this, "_getConnectionID", function () {
      var _this$wsConnection, _this$wsFallback;

      return ((_this$wsConnection = _this.wsConnection) === null || _this$wsConnection === void 0 ? void 0 : _this$wsConnection.connectionID) || ((_this$wsFallback = _this.wsFallback) === null || _this$wsFallback === void 0 ? void 0 : _this$wsFallback.connectionID);
    });

    _defineProperty__default['default'](this, "_hasConnectionID", function () {
      return Boolean(_this._getConnectionID());
    });

    _defineProperty__default['default'](this, "connectUser", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(user, userTokenOrProvider) {
        var setTokenPromise, wsPromise;
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (user.id) {
                  _context.next = 2;
                  break;
                }

                throw new Error('The "id" field on the user is missing');

              case 2:
                if (!(_this.userID === user.id && _this.setUserPromise)) {
                  _context.next = 5;
                  break;
                }

                console.warn('Consecutive calls to connectUser is detected, ideally you should only call this function once in your app.');
                return _context.abrupt("return", _this.setUserPromise);

              case 5:
                if (!_this.userID) {
                  _context.next = 7;
                  break;
                }

                throw new Error('Use client.disconnect() before trying to connect as a different user. connectUser was called twice.');

              case 7:
                if ((_this._isUsingServerAuth() || _this.node) && !_this.options.allowServerSideConnect) {
                  console.warn('Please do not use connectUser server side. connectUser impacts MAU and concurrent connection usage and thus your bill. If you have a valid use-case, add "allowServerSideConnect: true" to the client options to disable this warning.');
                } // we generate the client id client side


                _this.userID = user.id;
                _this.anonymous = false;
                setTokenPromise = _this._setToken(user, userTokenOrProvider);

                _this._setUser(user);

                wsPromise = _this.openConnection();
                _this.setUserPromise = Promise.all([setTokenPromise, wsPromise]).then(function (result) {
                  return result[1];
                } // We only return connection promise;
                );
                _context.prev = 14;
                _context.next = 17;
                return _this.setUserPromise;

              case 17:
                return _context.abrupt("return", _context.sent);

              case 20:
                _context.prev = 20;
                _context.t0 = _context["catch"](14);

                // cleanup client to allow the user to retry connectUser again
                _this.disconnectUser();

                throw _context.t0;

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[14, 20]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "setUser", this.connectUser);

    _defineProperty__default['default'](this, "_setToken", function (user, userTokenOrProvider) {
      return _this.tokenManager.setTokenOrProvider(userTokenOrProvider, user);
    });

    _defineProperty__default['default'](this, "closeConnection", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee2(timeout) {
        var _this$wsConnection2, _this$wsFallback2;

        return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_this.cleaningIntervalRef != null) {
                  clearInterval(_this.cleaningIntervalRef);
                  _this.cleaningIntervalRef = undefined;
                }

                _context2.next = 3;
                return Promise.all([(_this$wsConnection2 = _this.wsConnection) === null || _this$wsConnection2 === void 0 ? void 0 : _this$wsConnection2.disconnect(timeout), (_this$wsFallback2 = _this.wsFallback) === null || _this$wsFallback2 === void 0 ? void 0 : _this$wsFallback2.disconnect(timeout)]);

              case 3:
                return _context2.abrupt("return", Promise.resolve());

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "openConnection", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee3() {
      var _this$wsConnection3, _this$wsFallback3;

      return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (_this.userID) {
                _context3.next = 2;
                break;
              }

              throw Error('User is not set on client, use client.connectUser or client.connectAnonymousUser instead');

            case 2:
              if (!(((_this$wsConnection3 = _this.wsConnection) !== null && _this$wsConnection3 !== void 0 && _this$wsConnection3.isHealthy || (_this$wsFallback3 = _this.wsFallback) !== null && _this$wsFallback3 !== void 0 && _this$wsFallback3.isHealthy()) && _this._hasConnectionID())) {
                _context3.next = 5;
                break;
              }

              _this.logger('info', 'client:openConnection() - openConnection called twice, healthy connection already exists', {
                tags: ['connection', 'client']
              });

              return _context3.abrupt("return", Promise.resolve());

            case 5:
              _this.clientID = "".concat(_this.userID, "--").concat(randomId());
              _this.wsPromise = _this.connect();

              _this._startCleaning();

              return _context3.abrupt("return", _this.wsPromise);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));

    _defineProperty__default['default'](this, "_setupConnection", this.openConnection);

    _defineProperty__default['default'](this, "_normalizeDate", function (before) {
      if (before instanceof Date) {
        before = before.toISOString();
      }

      if (before === '') {
        throw new Error("Don't pass blank string for since, use null instead if resetting the token revoke");
      }

      return before;
    });

    _defineProperty__default['default'](this, "disconnectUser", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee4(timeout) {
        var closePromise, _i, _Object$values, _channel;

        return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _this.logger('info', 'client:disconnect() - Disconnecting the client', {
                  tags: ['connection', 'client']
                }); // remove the user specific fields


                delete _this.user;
                delete _this._user;
                delete _this.userID;
                _this.anonymous = false;
                closePromise = _this.closeConnection(timeout);

                for (_i = 0, _Object$values = Object.values(_this.activeChannels); _i < _Object$values.length; _i++) {
                  _channel = _Object$values[_i];

                  _channel._disconnect();
                } // ensure we no longer return inactive channels


                _this.activeChannels = {}; // reset client state

                _this.state = new ClientState(); // reset token manager

                setTimeout(_this.tokenManager.reset); // delay reseting to use token for disconnect calls
                // close the WS connection

                return _context4.abrupt("return", closePromise);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "disconnect", this.disconnectUser);

    _defineProperty__default['default'](this, "connectAnonymousUser", function () {
      if ((_this._isUsingServerAuth() || _this.node) && !_this.options.allowServerSideConnect) {
        console.warn('Please do not use connectUser server side. connectUser impacts MAU and concurrent connection usage and thus your bill. If you have a valid use-case, add "allowServerSideConnect: true" to the client options to disable this warning.');
      }

      _this.anonymous = true;
      _this.userID = randomId();
      var anonymousUser = {
        id: _this.userID,
        anon: true
      };

      _this._setToken(anonymousUser, '');

      _this._setUser(anonymousUser);

      return _this._setupConnection();
    });

    _defineProperty__default['default'](this, "setAnonymousUser", this.connectAnonymousUser);

    _defineProperty__default['default'](this, "doAxiosRequest", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee5(type, url, data) {
        var options,
            requestConfig,
            response,
            _requestConfig$header,
            _args5 = arguments;

        return _regeneratorRuntime__default['default'].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                options = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
                _context5.next = 3;
                return _this.tokenManager.tokenReady();

              case 3:
                requestConfig = _this._enrichAxiosOptions(options);
                _context5.prev = 4;

                _this._logApiRequest(type, url, data, requestConfig);

                _context5.t0 = type;
                _context5.next = _context5.t0 === 'get' ? 9 : _context5.t0 === 'delete' ? 13 : _context5.t0 === 'post' ? 17 : _context5.t0 === 'put' ? 21 : _context5.t0 === 'patch' ? 25 : _context5.t0 === 'options' ? 29 : 33;
                break;

              case 9:
                _context5.next = 11;
                return _this.axiosInstance.get(url, requestConfig);

              case 11:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 13:
                _context5.next = 15;
                return _this.axiosInstance.delete(url, requestConfig);

              case 15:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 17:
                _context5.next = 19;
                return _this.axiosInstance.post(url, data, requestConfig);

              case 19:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 21:
                _context5.next = 23;
                return _this.axiosInstance.put(url, data, requestConfig);

              case 23:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 25:
                _context5.next = 27;
                return _this.axiosInstance.patch(url, data, requestConfig);

              case 27:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 29:
                _context5.next = 31;
                return _this.axiosInstance.options(url, requestConfig);

              case 31:
                response = _context5.sent;
                return _context5.abrupt("break", 34);

              case 33:
                throw new Error('Invalid request type');

              case 34:
                _this._logApiResponse(type, url, response);

                _this.consecutiveFailures = 0;
                return _context5.abrupt("return", _this.handleResponse(response));

              case 39:
                _context5.prev = 39;
                _context5.t1 = _context5["catch"](4);
                _context5.t1.client_request_id = (_requestConfig$header = requestConfig.headers) === null || _requestConfig$header === void 0 ? void 0 : _requestConfig$header['x-client-request-id'];

                _this._logApiError(type, url, _context5.t1);

                _this.consecutiveFailures += 1;

                if (!_context5.t1.response) {
                  _context5.next = 56;
                  break;
                }

                if (!(_context5.t1.response.data.code === chatCodes.TOKEN_EXPIRED && !_this.tokenManager.isStatic())) {
                  _context5.next = 53;
                  break;
                }

                if (!(_this.consecutiveFailures > 1)) {
                  _context5.next = 49;
                  break;
                }

                _context5.next = 49;
                return sleep(retryInterval(_this.consecutiveFailures));

              case 49:
                _this.tokenManager.loadToken();

                _context5.next = 52;
                return _this.doAxiosRequest(type, url, data, options);

              case 52:
                return _context5.abrupt("return", _context5.sent);

              case 53:
                return _context5.abrupt("return", _this.handleResponse(_context5.t1.response));

              case 56:
                throw _context5.t1;

              case 57:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[4, 39]]);
      }));

      return function (_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty__default['default'](this, "dispatchEvent", function (event) {
      if (!event.received_at) event.received_at = new Date(); // client event handlers

      var postListenerCallbacks = _this._handleClientEvent(event); // channel event handlers


      var cid = event.cid;
      var channel = cid ? _this.activeChannels[cid] : undefined;

      if (channel) {
        channel._handleChannelEvent(event);
      }

      _this._callClientListeners(event);

      if (channel) {
        channel._callChannelListeners(event);
      }

      postListenerCallbacks.forEach(function (c) {
        return c();
      });
    });

    _defineProperty__default['default'](this, "handleEvent", function (messageEvent) {
      // dispatch the event to the channel listeners
      var jsonString = messageEvent.data;
      var event = JSON.parse(jsonString);

      _this.dispatchEvent(event);
    });

    _defineProperty__default['default'](this, "_updateMemberWatcherReferences", function (user) {
      var refMap = _this.state.userChannelReferences[user.id] || {};

      for (var _channelID in refMap) {
        var _channel2 = _this.activeChannels[_channelID];
        /** search the members and watchers and update as needed... */

        if (_channel2 !== null && _channel2 !== void 0 && _channel2.state) {
          if (_channel2.state.members[user.id]) {
            _channel2.state.members[user.id].user = user;
          }

          if (_channel2.state.watchers[user.id]) {
            _channel2.state.watchers[user.id] = user;
          }
        }
      }
    });

    _defineProperty__default['default'](this, "_updateUserReferences", this._updateMemberWatcherReferences);

    _defineProperty__default['default'](this, "_updateUserMessageReferences", function (user) {
      var refMap = _this.state.userChannelReferences[user.id] || {};

      for (var _channelID2 in refMap) {
        var _channel3 = _this.activeChannels[_channelID2];
        var state = _channel3.state;
        /** update the messages from this user. */

        state === null || state === void 0 ? void 0 : state.updateUserMessages(user);
      }
    });

    _defineProperty__default['default'](this, "_deleteUserMessageReference", function (user) {
      var hardDelete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var refMap = _this.state.userChannelReferences[user.id] || {};

      for (var _channelID3 in refMap) {
        var _channel4 = _this.activeChannels[_channelID3];
        var state = _channel4.state;
        /** deleted the messages from this user. */

        state === null || state === void 0 ? void 0 : state.deleteUserMessages(user, hardDelete);
      }
    });

    _defineProperty__default['default'](this, "_handleUserEvent", function (event) {
      if (!event.user) {
        return;
      }
      /** update the client.state with any changes to users */


      if (event.type === 'user.presence.changed' || event.type === 'user.updated') {
        if (event.user.id === _this.userID) {
          var user = _objectSpread({}, _this.user || {});

          var _user = _objectSpread({}, _this._user || {}); // Remove deleted properties from user objects.


          for (var _key2 in _this.user) {
            if (_key2 in event.user || isOwnUserBaseProperty(_key2)) {
              continue;
            }

            delete user[_key2];
            delete _user[_key2];
          }
          /** Updating only available properties in _user object. */


          for (var _key3 in event.user) {
            if (_user && _key3 in _user) {
              _user[_key3] = event.user[_key3];
            }
          } // @ts-expect-error


          _this._user = _objectSpread({}, _user);
          _this.user = _objectSpread(_objectSpread({}, user), event.user);
        }

        _this.state.updateUser(event.user);

        _this._updateMemberWatcherReferences(event.user);
      }

      if (event.type === 'user.updated') {
        _this._updateUserMessageReferences(event.user);
      }

      if (event.type === 'user.deleted' && event.user.deleted_at && (event.mark_messages_deleted || event.hard_delete)) {
        _this._deleteUserMessageReference(event.user, event.hard_delete);
      }
    });

    _defineProperty__default['default'](this, "_callClientListeners", function (event) {
      var client = _this; // gather and call the listeners

      var listeners = [];

      if (client.listeners.all) {
        listeners.push.apply(listeners, _toConsumableArray__default['default'](client.listeners.all));
      }

      if (client.listeners[event.type]) {
        listeners.push.apply(listeners, _toConsumableArray__default['default'](client.listeners[event.type]));
      } // call the event and send it to the listeners


      for (var _i2 = 0, _listeners = listeners; _i2 < _listeners.length; _i2++) {
        var listener = _listeners[_i2];
        listener(event);
      }
    });

    _defineProperty__default['default'](this, "recoverState", /*#__PURE__*/_asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee6() {
      var cids;
      return _regeneratorRuntime__default['default'].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _this.logger('info', "client:recoverState() - Start of recoverState with connectionID ".concat(_this._getConnectionID()), {
                tags: ['connection']
              });

              cids = Object.keys(_this.activeChannels);

              if (!(cids.length && _this.recoverStateOnReconnect)) {
                _context6.next = 10;
                break;
              }

              _this.logger('info', "client:recoverState() - Start the querying of ".concat(cids.length, " channels"), {
                tags: ['connection', 'client']
              });

              _context6.next = 6;
              return _this.queryChannels({
                cid: {
                  $in: cids
                }
              }, {
                last_message_at: -1
              }, {
                limit: 30
              });

            case 6:
              _this.logger('info', 'client:recoverState() - Querying channels finished', {
                tags: ['connection', 'client']
              });

              _this.dispatchEvent({
                type: 'connection.recovered'
              });

              _context6.next = 11;
              break;

            case 10:
              _this.dispatchEvent({
                type: 'connection.recovered'
              });

            case 11:
              _this.wsPromise = Promise.resolve();
              _this.setUserPromise = Promise.resolve();

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));

    _defineProperty__default['default'](this, "filterMessagesAfterTime", function (message, createdAfter) {
      return message.created_at ? Date.parse(message.created_at) > createdAfter : true;
    });

    _defineProperty__default['default'](this, "getChannelByMembers", function (channelType, custom) {
      // Check if the channel already exists.
      // Only allow 1 channel object per cid
      var membersStr = _toConsumableArray__default['default'](custom.members || []).sort().join(',');

      var tempCid = "".concat(channelType, ":!members-").concat(membersStr);

      if (!membersStr) {
        throw Error('Please specify atleast one member when creating unique conversation');
      } // channel could exist in `activeChannels` list with either one of the following two keys:
      // 1. cid - Which gets set on channel only after calling channel.query or channel.watch or channel.create
      // 2. Sorted membersStr - E.g., "messaging:amin,vishal" OR "messaging:amin,jaap,tom"
      //                        This is set when you create a channel, but haven't queried yet. After query,
      //                        we will replace it with `cid`


      for (var _key4 in _this.activeChannels) {
        var _channel5 = _this.activeChannels[_key4];

        if (_channel5.disconnected) {
          continue;
        }

        if (_key4 === tempCid) {
          return _channel5;
        }

        if (_key4.indexOf("".concat(channelType, ":!members-")) === 0) {
          var membersStrInExistingChannel = Object.keys(_channel5.state.members).sort().join(',');

          if (membersStrInExistingChannel === membersStr) {
            return _channel5;
          }
        }
      }

      var channel = new Channel(_this, channelType, undefined, custom); // For the time being set the key as membersStr, since we don't know the cid yet.
      // In channel.query, we will replace it with 'cid'.

      _this.activeChannels[tempCid] = channel;
      return channel;
    });

    _defineProperty__default['default'](this, "getChannelById", function (channelType, channelID, custom) {
      if (typeof channelID === 'string' && ~channelID.indexOf(':')) {
        throw Error("Invalid channel id ".concat(channelID, ", can't contain the : character"));
      } // only allow 1 channel object per cid


      var cid = "".concat(channelType, ":").concat(channelID);

      if (cid in _this.activeChannels && !_this.activeChannels[cid].disconnected) {
        var _channel6 = _this.activeChannels[cid];

        if (Object.keys(custom).length > 0) {
          _channel6.data = custom;
          _channel6._data = custom;
        }

        return _channel6;
      }

      var channel = new Channel(_this, channelType, channelID, custom);
      _this.activeChannels[channel.cid] = channel;
      return channel;
    });

    _defineProperty__default['default'](this, "updateUsers", this.upsertUsers);

    _defineProperty__default['default'](this, "updateUser", this.upsertUser);

    _defineProperty__default['default'](this, "markAllRead", this.markChannelsRead);

    _defineProperty__default['default'](this, "_isUsingServerAuth", function () {
      return !!_this.secret;
    });

    _defineProperty__default['default'](this, "_buildWSPayload", function (client_request_id) {
      return JSON.stringify({
        user_id: _this.userID,
        user_details: _this._user,
        device: _this.options.device,
        client_request_id: client_request_id
      });
    });

    // set the key
    this.key = _key;
    this.listeners = {};
    this.state = new ClientState(); // a list of channels to hide ws events from

    this.mutedChannels = [];
    this.mutedUsers = []; // set the secret

    if (secretOrOptions && isString(secretOrOptions)) {
      this.secret = secretOrOptions;
    } // set the options... and figure out defaults...


    var inputOptions = _options ? _options : secretOrOptions && !isString(secretOrOptions) ? secretOrOptions : {};
    this.browser = typeof inputOptions.browser !== 'undefined' ? inputOptions.browser : typeof window !== 'undefined';
    this.node = !this.browser;
    this.options = _objectSpread({
      timeout: 3000,
      withCredentials: false,
      // making sure cookies are not sent
      warmUp: false,
      recoverStateOnReconnect: true
    }, inputOptions);

    if (this.node && !this.options.httpsAgent) {
      this.options.httpsAgent = new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 3000
      });
    }

    this.axiosInstance = axios__default['default'].create(this.options);
    this.setBaseURL(this.options.baseURL || 'https://chat.stream-io-api.com');

    if (typeof process !== 'undefined' && process.env.STREAM_LOCAL_TEST_RUN) {
      this.setBaseURL('http://localhost:3030');
    }

    if (typeof process !== 'undefined' && process.env.STREAM_LOCAL_TEST_HOST) {
      this.setBaseURL('http://' + process.env.STREAM_LOCAL_TEST_HOST);
    } // WS connection is initialized when setUser is called


    this.wsConnection = null;
    this.wsPromise = null;
    this.setUserPromise = null; // keeps a reference to all the channels that are in use

    this.activeChannels = {}; // mapping between channel groups and configs

    this.configs = {};
    this.anonymous = false; // If its a server-side client, then lets initialize the tokenManager, since token will be
    // generated from secret.

    this.tokenManager = new TokenManager(this.secret);
    this.consecutiveFailures = 0;
    this.insightMetrics = new InsightMetrics();
    this.defaultWSTimeoutWithFallback = 6000;
    this.defaultWSTimeout = 15000;
    /**
     * logger function should accept 3 parameters:
     * @param logLevel string
     * @param message   string
     * @param extraData object
     *
     * e.g.,
     * const client = new StreamChat('api_key', {}, {
     * 		logger = (logLevel, message, extraData) => {
     * 			console.log(message);
     * 		}
     * })
     *
     * extraData contains tags array attached to log message. Tags can have one/many of following values:
     * 1. api
     * 2. api_request
     * 3. api_response
     * 4. client
     * 5. channel
     * 6. connection
     * 7. event
     *
     * It may also contains some extra data, some examples have been mentioned below:
     * 1. {
     * 		tags: ['api', 'api_request', 'client'],
     * 		url: string,
     * 		payload: object,
     * 		config: object
     * }
     * 2. {
     * 		tags: ['api', 'api_response', 'client'],
     * 		url: string,
     * 		response: object
     * }
     * 3. {
     * 		tags: ['api', 'api_response', 'client'],
     * 		url: string,
     * 		error: object
     * }
     * 4. {
     * 		tags: ['event', 'client'],
     * 		event: object
     * }
     * 5. {
     * 		tags: ['channel'],
     * 		channel: object
     * }
     */

    this.logger = isFunction(inputOptions.logger) ? inputOptions.logger : function () {
      return null;
    };
    this.recoverStateOnReconnect = this.options.recoverStateOnReconnect;
  }
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


  _createClass__default['default'](StreamChat, [{
    key: "devToken",
    value: function devToken(userID) {
      return DevToken(userID);
    }
  }, {
    key: "getAuthType",
    value: function getAuthType() {
      return this.anonymous ? 'anonymous' : 'jwt';
    }
  }, {
    key: "setBaseURL",
    value: function setBaseURL(baseURL) {
      this.baseURL = baseURL;
      this.wsBaseURL = this.baseURL.replace('http', 'ws').replace(':3030', ':8800');
    }
  }, {
    key: "_setUser",
    value: function _setUser(user) {
      /**
       * This one is used by the frontend. This is a copy of the current user object stored on backend.
       * It contains reserved properties and own user properties which are not present in `this._user`.
       */
      this.user = user; // this one is actually used for requests. This is a copy of current user provided to `connectUser` function.

      this._user = _objectSpread({}, user);
    }
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

  }, {
    key: "updateAppSettings",
    value:
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
    function () {
      var _updateAppSettings = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee7(options) {
        var _options$apn_config;

        return _regeneratorRuntime__default['default'].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if ((_options$apn_config = options.apn_config) !== null && _options$apn_config !== void 0 && _options$apn_config.p12_cert) {
                  options.apn_config.p12_cert = Buffer.from(options.apn_config.p12_cert).toString('base64');
                }

                _context7.next = 3;
                return this.patch(this.baseURL + '/app', options);

              case 3:
                return _context7.abrupt("return", _context7.sent);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function updateAppSettings(_x8) {
        return _updateAppSettings.apply(this, arguments);
      }

      return updateAppSettings;
    }()
  }, {
    key: "revokeTokens",
    value:
    /**
     * Revokes all tokens on application level issued before given time
     */
    function () {
      var _revokeTokens = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee8(before) {
        return _regeneratorRuntime__default['default'].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.updateAppSettings({
                  revoke_tokens_issued_before: this._normalizeDate(before)
                });

              case 2:
                return _context8.abrupt("return", _context8.sent);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function revokeTokens(_x9) {
        return _revokeTokens.apply(this, arguments);
      }

      return revokeTokens;
    }()
    /**
     * Revokes token for a user issued before given time
     */

  }, {
    key: "revokeUserToken",
    value: function () {
      var _revokeUserToken = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee9(userID, before) {
        return _regeneratorRuntime__default['default'].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.revokeUsersToken([userID], before);

              case 2:
                return _context9.abrupt("return", _context9.sent);

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function revokeUserToken(_x10, _x11) {
        return _revokeUserToken.apply(this, arguments);
      }

      return revokeUserToken;
    }()
    /**
     * Revokes tokens for a list of users issued before given time
     */

  }, {
    key: "revokeUsersToken",
    value: function () {
      var _revokeUsersToken = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee10(userIDs, before) {
        var users, _iterator, _step, userID;

        return _regeneratorRuntime__default['default'].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (before === undefined) {
                  before = new Date().toISOString();
                } else {
                  before = this._normalizeDate(before);
                }

                users = [];
                _iterator = _createForOfIteratorHelper(userIDs);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    userID = _step.value;
                    users.push({
                      id: userID,
                      set: {
                        revoke_tokens_issued_before: before
                      }
                    });
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                _context10.next = 6;
                return this.partialUpdateUsers(users);

              case 6:
                return _context10.abrupt("return", _context10.sent);

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function revokeUsersToken(_x12, _x13) {
        return _revokeUsersToken.apply(this, arguments);
      }

      return revokeUsersToken;
    }()
    /**
     * getAppSettings - retrieves application settings
     */

  }, {
    key: "getAppSettings",
    value: function () {
      var _getAppSettings = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee11() {
        return _regeneratorRuntime__default['default'].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.get(this.baseURL + '/app');

              case 2:
                return _context11.abrupt("return", _context11.sent);

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getAppSettings() {
        return _getAppSettings.apply(this, arguments);
      }

      return getAppSettings;
    }()
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

  }, {
    key: "testPushSettings",
    value: function () {
      var _testPushSettings = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee12(userID) {
        var data,
            _args12 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                data = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
                _context12.next = 3;
                return this.post(this.baseURL + '/check_push', _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
                  user_id: userID
                }, data.messageID ? {
                  message_id: data.messageID
                } : {}), data.apnTemplate ? {
                  apn_template: data.apnTemplate
                } : {}), data.firebaseTemplate ? {
                  firebase_template: data.firebaseTemplate
                } : {}), data.firebaseDataTemplate ? {
                  firebase_data_template: data.firebaseDataTemplate
                } : {}), data.huaweiDataTemplate ? {
                  huawei_data_template: data.huaweiDataTemplate
                } : {}), data.skipDevices ? {
                  skip_devices: true
                } : {}));

              case 3:
                return _context12.abrupt("return", _context12.sent);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function testPushSettings(_x14) {
        return _testPushSettings.apply(this, arguments);
      }

      return testPushSettings;
    }()
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

  }, {
    key: "testSQSSettings",
    value: function () {
      var _testSQSSettings = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee13() {
        var data,
            _args13 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                data = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : {};
                _context13.next = 3;
                return this.post(this.baseURL + '/check_sqs', data);

              case 3:
                return _context13.abrupt("return", _context13.sent);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function testSQSSettings() {
        return _testSQSSettings.apply(this, arguments);
      }

      return testSQSSettings;
    }()
    /**
     * Disconnects the websocket and removes the user from client.
     *
     * @param timeout Max number of ms, to wait for close event of websocket, before forcefully assuming successful disconnection.
     *                https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */

  }, {
    key: "setGuestUser",
    value:
    /**
     * setGuestUser - Setup a temporary guest user
     *
     * @param {UserResponse<UserType>} user Data about this user. IE {name: "john"}
     *
     * @return {ConnectAPIResponse<ChannelType, CommandType, UserType>} Returns a promise that resolves when the connection is setup
     */
    function () {
      var _setGuestUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee14(user) {
        var response, _response$user, guestUser;

        return _regeneratorRuntime__default['default'].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.anonymous = true;
                _context14.prev = 1;
                _context14.next = 4;
                return this.post(this.baseURL + '/guest', {
                  user: user
                });

              case 4:
                response = _context14.sent;
                _context14.next = 11;
                break;

              case 7:
                _context14.prev = 7;
                _context14.t0 = _context14["catch"](1);
                this.anonymous = false;
                throw _context14.t0;

              case 11:
                this.anonymous = false; // eslint-disable-next-line @typescript-eslint/no-unused-vars

                _response$user = response.user, _response$user.created_at, _response$user.updated_at, _response$user.last_active, _response$user.online, guestUser = _objectWithoutProperties__default['default'](_response$user, _excluded);
                _context14.next = 15;
                return this.connectUser(guestUser, response.access_token);

              case 15:
                return _context14.abrupt("return", _context14.sent);

              case 16:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[1, 7]]);
      }));

      function setGuestUser(_x15) {
        return _setGuestUser.apply(this, arguments);
      }

      return setGuestUser;
    }()
    /**
     * createToken - Creates a token to authenticate this user. This function is used server side.
     * The resulting token should be passed to the client side when the users registers or logs in
     *
     * @param {string} userID The User ID
     * @param {number} [exp] The expiration time for the token expressed in the number of seconds since the epoch
     *
     * @return {string} Returns a token
     */

  }, {
    key: "createToken",
    value: function createToken(userID, exp, iat) {
      if (this.secret == null) {
        throw Error("tokens can only be created server-side using the API Secret");
      }

      var extra = {};

      if (exp) {
        extra.exp = exp;
      }

      if (iat) {
        extra.iat = iat;
      }

      return JWTUserToken(this.secret, userID, extra, {});
    }
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

  }, {
    key: "on",
    value: function on(callbackOrString, callbackOrNothing) {
      var _this2 = this;

      var key = callbackOrNothing ? callbackOrString : 'all';
      var valid = isValidEventType(key);

      if (!valid) {
        throw Error("Invalid event type ".concat(key));
      }

      var callback = callbackOrNothing ? callbackOrNothing : callbackOrString;

      if (!(key in this.listeners)) {
        this.listeners[key] = [];
      }

      this.logger('info', "Attaching listener for ".concat(key, " event"), {
        tags: ['event', 'client']
      });
      this.listeners[key].push(callback);
      return {
        unsubscribe: function unsubscribe() {
          _this2.logger('info', "Removing listener for ".concat(key, " event"), {
            tags: ['event', 'client']
          });

          _this2.listeners[key] = _this2.listeners[key].filter(function (el) {
            return el !== callback;
          });
        }
      };
    }
    /**
     * off - Remove the event handler
     *
     */

  }, {
    key: "off",
    value: function off(callbackOrString, callbackOrNothing) {
      var key = callbackOrNothing ? callbackOrString : 'all';
      var valid = isValidEventType(key);

      if (!valid) {
        throw Error("Invalid event type ".concat(key));
      }

      var callback = callbackOrNothing ? callbackOrNothing : callbackOrString;

      if (!(key in this.listeners)) {
        this.listeners[key] = [];
      }

      this.logger('info', "Removing listener for ".concat(key, " event"), {
        tags: ['event', 'client']
      });
      this.listeners[key] = this.listeners[key].filter(function (value) {
        return value !== callback;
      });
    }
  }, {
    key: "_logApiRequest",
    value: function _logApiRequest(type, url, data, config) {
      this.logger('info', "client: ".concat(type, " - Request - ").concat(url), {
        tags: ['api', 'api_request', 'client'],
        url: url,
        payload: data,
        config: config
      });
    }
  }, {
    key: "_logApiResponse",
    value: function _logApiResponse(type, url, response) {
      this.logger('info', "client:".concat(type, " - Response - url: ").concat(url, " > status ").concat(response.status), {
        tags: ['api', 'api_response', 'client'],
        url: url,
        response: response
      });
    }
  }, {
    key: "_logApiError",
    value: function _logApiError(type, url, error) {
      this.logger('error', "client:".concat(type, " - Error - url: ").concat(url), {
        tags: ['api', 'api_response', 'client'],
        url: url,
        error: error
      });
    }
  }, {
    key: "get",
    value: function get(url, params) {
      return this.doAxiosRequest('get', url, null, {
        params: params
      });
    }
  }, {
    key: "put",
    value: function put(url, data) {
      return this.doAxiosRequest('put', url, data);
    }
  }, {
    key: "post",
    value: function post(url, data) {
      return this.doAxiosRequest('post', url, data);
    }
  }, {
    key: "patch",
    value: function patch(url, data) {
      return this.doAxiosRequest('patch', url, data);
    }
  }, {
    key: "delete",
    value: function _delete(url, params) {
      return this.doAxiosRequest('delete', url, null, {
        params: params
      });
    }
  }, {
    key: "sendFile",
    value: function sendFile(url, uri, name, contentType, user) {
      var data = addFileToFormData(uri, name, contentType);
      if (user != null) data.append('user', JSON.stringify(user));
      return this.doAxiosRequest('post', url, data, {
        headers: data.getHeaders ? data.getHeaders() : {},
        // node vs browser
        config: {
          timeout: 0,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      });
    }
  }, {
    key: "errorFromResponse",
    value: function errorFromResponse(response) {
      var err;
      err = new Error("StreamChat error HTTP code: ".concat(response.status));

      if (response.data && response.data.code) {
        err = new Error("StreamChat error code ".concat(response.data.code, ": ").concat(response.data.message));
        err.code = response.data.code;
      }

      err.response = response;
      err.status = response.status;
      return err;
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      var data = response.data;

      if ((response.status + '')[0] !== '2') {
        throw this.errorFromResponse(response);
      }

      return data;
    }
  }, {
    key: "_handleClientEvent",
    value: function _handleClientEvent(event) {
      var _event$me,
          _this3 = this,
          _event$me2;

      var client = this;
      var postListenerCallbacks = [];
      this.logger('info', "client:_handleClientEvent - Received event of type { ".concat(event.type, " }"), {
        tags: ['event', 'client'],
        event: event
      });

      if (event.type === 'user.presence.changed' || event.type === 'user.updated' || event.type === 'user.deleted') {
        this._handleUserEvent(event);
      }

      if (event.type === 'health.check' && event.me) {
        client.user = event.me;
        client.state.updateUser(event.me);
        client.mutedChannels = event.me.channel_mutes;
        client.mutedUsers = event.me.mutes;
      }

      if (event.channel && event.type === 'notification.message_new') {
        this.configs[event.channel.type] = event.channel.config;
      }

      if (event.type === 'notification.channel_mutes_updated' && (_event$me = event.me) !== null && _event$me !== void 0 && _event$me.channel_mutes) {
        var currentMutedChannelIds = [];
        var nextMutedChannelIds = [];
        this.mutedChannels.forEach(function (mute) {
          return mute.channel && currentMutedChannelIds.push(mute.channel.cid);
        });
        event.me.channel_mutes.forEach(function (mute) {
          return mute.channel && nextMutedChannelIds.push(mute.channel.cid);
        });
        /** Set the unread count of un-muted channels to 0, which is the behaviour of backend */

        currentMutedChannelIds.forEach(function (cid) {
          if (!nextMutedChannelIds.includes(cid) && _this3.activeChannels[cid]) {
            _this3.activeChannels[cid].state.unreadCount = 0;
          }
        });
        this.mutedChannels = event.me.channel_mutes;
      }

      if (event.type === 'notification.mutes_updated' && (_event$me2 = event.me) !== null && _event$me2 !== void 0 && _event$me2.mutes) {
        this.mutedUsers = event.me.mutes;
      }

      if ((event.type === 'channel.deleted' || event.type === 'notification.channel_deleted') && event.cid) {
        var _this$activeChannels$;

        client.state.deleteAllChannelReference(event.cid);
        (_this$activeChannels$ = this.activeChannels[event.cid]) === null || _this$activeChannels$ === void 0 ? void 0 : _this$activeChannels$._disconnect();
        postListenerCallbacks.push(function () {
          if (!event.cid) return;
          delete _this3.activeChannels[event.cid];
        });
      }

      return postListenerCallbacks;
    }
  }, {
    key: "_muteStatus",
    value: function _muteStatus(cid) {
      var muteStatus;

      for (var i = 0; i < this.mutedChannels.length; i++) {
        var _mute$channel;

        var mute = this.mutedChannels[i];

        if (((_mute$channel = mute.channel) === null || _mute$channel === void 0 ? void 0 : _mute$channel.cid) === cid) {
          muteStatus = {
            muted: mute.expires ? new Date(mute.expires).getTime() > new Date().getTime() : true,
            createdAt: mute.created_at ? new Date(mute.created_at) : new Date(),
            expiresAt: mute.expires ? new Date(mute.expires) : null
          };
          break;
        }
      }

      if (muteStatus) {
        return muteStatus;
      }

      return {
        muted: false,
        createdAt: null,
        expiresAt: null
      };
    }
  }, {
    key: "connect",
    value:
    /**
     * @private
     */
    function () {
      var _connect = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee15() {
        return _regeneratorRuntime__default['default'].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!(!this.userID || !this._user)) {
                  _context15.next = 2;
                  break;
                }

                throw Error('Call connectUser or connectAnonymousUser before starting the connection');

              case 2:
                if (this.wsBaseURL) {
                  _context15.next = 4;
                  break;
                }

                throw Error('Websocket base url not set');

              case 4:
                if (this.clientID) {
                  _context15.next = 6;
                  break;
                }

                throw Error('clientID is not set');

              case 6:
                if (!this.wsConnection && (this.options.warmUp || this.options.enableInsights)) {
                  this._sayHi();
                } // The StableWSConnection handles all the reconnection logic.


                this.wsConnection = new StableWSConnection({
                  client: this
                });
                _context15.prev = 8;

                if (!this.wsFallback) {
                  _context15.next = 13;
                  break;
                }

                _context15.next = 12;
                return this.wsFallback.connect();

              case 12:
                return _context15.abrupt("return", _context15.sent);

              case 13:
                _context15.next = 15;
                return this.wsConnection.connect(this.options.enableWSFallback ? this.defaultWSTimeoutWithFallback : this.defaultWSTimeout);

              case 15:
                return _context15.abrupt("return", _context15.sent);

              case 18:
                _context15.prev = 18;
                _context15.t0 = _context15["catch"](8);

                if (!(this.options.enableWSFallback && isWSFailure(_context15.t0) && isOnline())) {
                  _context15.next = 29;
                  break;
                }

                this.logger('info', 'client:connect() - WS failed, fallback to longpoll', {
                  tags: ['connection', 'client']
                }); // @ts-expect-error

                this.dispatchEvent({
                  type: 'transport.changed',
                  mode: 'longpoll'
                });

                this.wsConnection._destroyCurrentWSConnection();

                this.wsConnection.disconnect().then(); // close WS so no retry

                this.wsFallback = new WSConnectionFallback({
                  client: this
                });
                _context15.next = 28;
                return this.wsFallback.connect();

              case 28:
                return _context15.abrupt("return", _context15.sent);

              case 29:
                throw _context15.t0;

              case 30:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[8, 18]]);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
    /**
     * Check the connectivity with server for warmup purpose.
     *
     * @private
     */

  }, {
    key: "_sayHi",
    value: function _sayHi() {
      var _this4 = this;

      var client_request_id = randomId();
      var opts = {
        headers: {
          'x-client-request-id': client_request_id
        }
      };
      this.doAxiosRequest('get', this.baseURL + '/hi', null, opts).catch(function (e) {
        if (_this4.options.enableInsights) {
          postInsights('http_hi_failed', {
            api_key: _this4.key,
            err: e,
            client_request_id: client_request_id
          });
        }
      });
    }
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

  }, {
    key: "queryUsers",
    value: function () {
      var _queryUsers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee16(filterConditions) {
        var sort,
            options,
            defaultOptions,
            data,
            _args16 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                sort = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : [];
                options = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : {};
                defaultOptions = {
                  presence: false
                }; // Make sure we wait for the connect promise if there is a pending one

                _context16.next = 5;
                return this.setUserPromise;

              case 5:
                if (!this._hasConnectionID()) {
                  defaultOptions.presence = false;
                } // Return a list of users


                _context16.next = 8;
                return this.get(this.baseURL + '/users', {
                  payload: _objectSpread(_objectSpread({
                    filter_conditions: filterConditions,
                    sort: normalizeQuerySort(sort)
                  }, defaultOptions), options)
                });

              case 8:
                data = _context16.sent;
                this.state.updateUsers(data.users);
                return _context16.abrupt("return", data);

              case 11:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function queryUsers(_x16) {
        return _queryUsers.apply(this, arguments);
      }

      return queryUsers;
    }()
    /**
     * queryBannedUsers - Query user bans
     *
     * @param {BannedUsersFilters} filterConditions MongoDB style filter conditions
     * @param {BannedUsersSort} sort Sort options [{created_at: 1}].
     * @param {BannedUsersPaginationOptions} options Option object, {limit: 10, offset:0}
     *
     * @return {Promise<BannedUsersResponse<ChannelType, CommandType, UserType>>} Ban Query Response
     */

  }, {
    key: "queryBannedUsers",
    value: function () {
      var _queryBannedUsers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee17() {
        var filterConditions,
            sort,
            options,
            _args17 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                filterConditions = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : {};
                sort = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : [];
                options = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : {};
                _context17.next = 5;
                return this.get(this.baseURL + '/query_banned_users', {
                  payload: _objectSpread({
                    filter_conditions: filterConditions,
                    sort: normalizeQuerySort(sort)
                  }, options)
                });

              case 5:
                return _context17.abrupt("return", _context17.sent);

              case 6:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function queryBannedUsers() {
        return _queryBannedUsers.apply(this, arguments);
      }

      return queryBannedUsers;
    }()
    /**
     * queryMessageFlags - Query message flags
     *
     * @param {MessageFlagsFilters} filterConditions MongoDB style filter conditions
     * @param {MessageFlagsPaginationOptions} options Option object, {limit: 10, offset:0}
     *
     * @return {Promise<MessageFlagsResponse<ChannelType, CommandType, UserType>>} Message Flags Response
     */

  }, {
    key: "queryMessageFlags",
    value: function () {
      var _queryMessageFlags = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee18() {
        var filterConditions,
            options,
            _args18 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                filterConditions = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : {};
                options = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : {};
                _context18.next = 4;
                return this.get(this.baseURL + '/moderation/flags/message', {
                  payload: _objectSpread({
                    filter_conditions: filterConditions
                  }, options)
                });

              case 4:
                return _context18.abrupt("return", _context18.sent);

              case 5:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function queryMessageFlags() {
        return _queryMessageFlags.apply(this, arguments);
      }

      return queryMessageFlags;
    }()
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

  }, {
    key: "queryChannels",
    value: function () {
      var _queryChannels = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee19(filterConditions) {
        var _this5 = this;

        var sort,
            options,
            defaultOptions,
            payload,
            data,
            channels,
            _iterator2,
            _step2,
            channelState,
            _iterator3,
            _step3,
            _c$messageFilters,
            _channelState,
            c,
            _args19 = arguments;

        return _regeneratorRuntime__default['default'].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                sort = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : [];
                options = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : {};
                defaultOptions = {
                  state: true,
                  watch: true,
                  presence: false
                }; // Make sure we wait for the connect promise if there is a pending one

                _context19.next = 5;
                return this.setUserPromise;

              case 5:
                if (!this._hasConnectionID()) {
                  defaultOptions.watch = false;
                } // Return a list of channels


                payload = _objectSpread(_objectSpread({
                  filter_conditions: filterConditions,
                  sort: normalizeQuerySort(sort)
                }, defaultOptions), options);
                _context19.next = 9;
                return this.post(this.baseURL + '/channels', payload);

              case 9:
                data = _context19.sent;
                channels = []; // update our cache of the configs

                _iterator2 = _createForOfIteratorHelper(data.channels);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    channelState = _step2.value;

                    this._addChannelConfig(channelState);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                _iterator3 = _createForOfIteratorHelper(data.channels);

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    _channelState = _step3.value;
                    c = this.channel(_channelState.channel.type, _channelState.channel.id);
                    c.data = _channelState.channel;
                    c.initialized = true;
                    c.state.clearMessages();

                    if ((_c$messageFilters = c.messageFilters) !== null && _c$messageFilters !== void 0 && _c$messageFilters.created_at_after) {
                      (function () {
                        var created_at_after = c.messageFilters.created_at_after;
                        var createdAfterTime = typeof created_at_after === 'string' ? Date.parse(created_at_after) : created_at_after.getTime();
                        _channelState.messages = _channelState.messages.filter(function (message) {
                          return _this5.filterMessagesAfterTime(message, createdAfterTime);
                        });
                        _channelState.pinned_messages = _channelState.pinned_messages.filter(function (message) {
                          return _this5.filterMessagesAfterTime(message, createdAfterTime);
                        });
                      })();
                    }

                    c._initializeState(_channelState);

                    channels.push(c);
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                return _context19.abrupt("return", channels);

              case 16:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function queryChannels(_x17) {
        return _queryChannels.apply(this, arguments);
      }

      return queryChannels;
    }()
  }, {
    key: "search",
    value:
    /**
     * search - Query messages
     *
     * @param {ChannelFilters<ChannelType, CommandType, UserType>} filterConditions MongoDB style filter conditions
     * @param {MessageFilters<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> | string} query search query or object MongoDB style filters
     * @param {SearchOptions<MessageType>} [options] Option object, {user_id: 'tommaso'}
     *
     * @return {Promise<SearchAPIResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>>} search messages response
     */
    function () {
      var _search = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee20(filterConditions, query) {
        var options,
            payload,
            _args20 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                options = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : {};

                if (!(options.offset && (options.sort || options.next))) {
                  _context20.next = 3;
                  break;
                }

                throw Error("Cannot specify offset with sort or next parameters");

              case 3:
                payload = _objectSpread(_objectSpread({
                  filter_conditions: filterConditions
                }, options), {}, {
                  sort: options.sort ? normalizeQuerySort(options.sort) : undefined
                });

                if (!(typeof query === 'string')) {
                  _context20.next = 8;
                  break;
                }

                payload.query = query;
                _context20.next = 13;
                break;

              case 8:
                if (!(_typeof__default['default'](query) === 'object')) {
                  _context20.next = 12;
                  break;
                }

                payload.message_filter_conditions = query;
                _context20.next = 13;
                break;

              case 12:
                throw Error("Invalid type ".concat(_typeof__default['default'](query), " for query parameter"));

              case 13:
                _context20.next = 15;
                return this.setUserPromise;

              case 15:
                _context20.next = 17;
                return this.get(this.baseURL + '/search', {
                  payload: payload
                });

              case 17:
                return _context20.abrupt("return", _context20.sent);

              case 18:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function search(_x18, _x19) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
    /**
     * setLocalDevice - Set the device info for the current client(device) that will be sent via WS connection automatically
     *
     * @param {BaseDeviceFields} device the device object
     * @param {string} device.id device id
     * @param {string} device.push_provider the push provider
     *
     */

  }, {
    key: "setLocalDevice",
    value: function setLocalDevice(device) {
      if (this.wsConnection || this.wsFallback) {
        throw new Error('you can only set device before opening a websocket connection');
      }

      this.options.device = device;
    }
    /**
     * addDevice - Adds a push device for a user.
     *
     * @param {string} id the device id
     * @param {PushProvider} push_provider the push provider
     * @param {string} [userID] the user id (defaults to current user)
     *
     */

  }, {
    key: "addDevice",
    value: function () {
      var _addDevice = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee21(id, push_provider, userID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.post(this.baseURL + '/devices', _objectSpread({
                  id: id,
                  push_provider: push_provider
                }, userID != null ? {
                  user_id: userID
                } : {}));

              case 2:
                return _context21.abrupt("return", _context21.sent);

              case 3:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function addDevice(_x20, _x21, _x22) {
        return _addDevice.apply(this, arguments);
      }

      return addDevice;
    }()
    /**
     * getDevices - Returns the devices associated with a current user
     *
     * @param {string} [userID] User ID. Only works on serverside
     *
     * @return {APIResponse & Device<UserType>[]} Array of devices
     */

  }, {
    key: "getDevices",
    value: function () {
      var _getDevices = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee22(userID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.get(this.baseURL + '/devices', userID ? {
                  user_id: userID
                } : {});

              case 2:
                return _context22.abrupt("return", _context22.sent);

              case 3:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function getDevices(_x23) {
        return _getDevices.apply(this, arguments);
      }

      return getDevices;
    }()
    /**
     * removeDevice - Removes the device with the given id. Clientside users can only delete their own devices
     *
     * @param {string} id The device id
     * @param {string} [userID] The user id. Only specify this for serverside requests
     *
     */

  }, {
    key: "removeDevice",
    value: function () {
      var _removeDevice = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee23(id, userID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this.delete(this.baseURL + '/devices', _objectSpread({
                  id: id
                }, userID ? {
                  user_id: userID
                } : {}));

              case 2:
                return _context23.abrupt("return", _context23.sent);

              case 3:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function removeDevice(_x24, _x25) {
        return _removeDevice.apply(this, arguments);
      }

      return removeDevice;
    }()
    /**
     * getRateLimits - Returns the rate limits quota and usage for the current app, possibly filter for a specific platform and/or endpoints.
     * Only available server-side.
     *
     * @param {object} [params] The params for the call. If none of the params are set, all limits for all platforms are returned.
     * @returns {Promise<GetRateLimitsResponse>}
     */

  }, {
    key: "getRateLimits",
    value: function () {
      var _getRateLimits = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee24(params) {
        var _ref7, serverSide, web, android, ios, endpoints;

        return _regeneratorRuntime__default['default'].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _ref7 = params || {}, serverSide = _ref7.serverSide, web = _ref7.web, android = _ref7.android, ios = _ref7.ios, endpoints = _ref7.endpoints;
                return _context24.abrupt("return", this.get(this.baseURL + '/rate_limits', {
                  server_side: serverSide,
                  web: web,
                  android: android,
                  ios: ios,
                  endpoints: endpoints ? endpoints.join(',') : undefined
                }));

              case 2:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function getRateLimits(_x26) {
        return _getRateLimits.apply(this, arguments);
      }

      return getRateLimits;
    }()
  }, {
    key: "_addChannelConfig",
    value: function _addChannelConfig(channelState) {
      this.configs[channelState.channel.type] = channelState.channel.config;
    }
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

  }, {
    key: "channel",
    value: function channel(channelType, channelIDOrCustom) {
      var custom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!this.userID && !this._isUsingServerAuth()) {
        throw Error('Call connectUser or connectAnonymousUser before creating a channel');
      }

      if (~channelType.indexOf(':')) {
        throw Error("Invalid channel group ".concat(channelType, ", can't contain the : character"));
      } // support channel("messaging", null, {options})
      // support channel("messaging", undefined, {options})
      // support channel("messaging", "", {options})


      if (channelIDOrCustom == null || channelIDOrCustom === '') {
        return new Channel(this, channelType, undefined, custom);
      } // support channel("messaging", {options})


      if (_typeof__default['default'](channelIDOrCustom) === 'object') {
        return this.getChannelByMembers(channelType, channelIDOrCustom);
      }

      return this.getChannelById(channelType, channelIDOrCustom, custom);
    }
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

  }, {
    key: "partialUpdateUser",
    value:
    /**
     * partialUpdateUser - Update the given user object
     *
     * @param {PartialUserUpdate<UserType>} partialUserObject which should contain id and any of "set" or "unset" params;
     * example: {id: "user1", set:{field: value}, unset:["field2"]}
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>} list of updated users
     */
    function () {
      var _partialUpdateUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee25(partialUserObject) {
        return _regeneratorRuntime__default['default'].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return this.partialUpdateUsers([partialUserObject]);

              case 2:
                return _context25.abrupt("return", _context25.sent);

              case 3:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function partialUpdateUser(_x27) {
        return _partialUpdateUser.apply(this, arguments);
      }

      return partialUpdateUser;
    }()
    /**
     * upsertUsers - Batch upsert the list of users
     *
     * @param {UserResponse<UserType>[]} users list of users
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */

  }, {
    key: "upsertUsers",
    value: function () {
      var _upsertUsers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee26(users) {
        var userMap, _iterator4, _step4, userObject;

        return _regeneratorRuntime__default['default'].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                userMap = {};
                _iterator4 = _createForOfIteratorHelper(users);
                _context26.prev = 2;

                _iterator4.s();

              case 4:
                if ((_step4 = _iterator4.n()).done) {
                  _context26.next = 11;
                  break;
                }

                userObject = _step4.value;

                if (userObject.id) {
                  _context26.next = 8;
                  break;
                }

                throw Error('User ID is required when updating a user');

              case 8:
                userMap[userObject.id] = userObject;

              case 9:
                _context26.next = 4;
                break;

              case 11:
                _context26.next = 16;
                break;

              case 13:
                _context26.prev = 13;
                _context26.t0 = _context26["catch"](2);

                _iterator4.e(_context26.t0);

              case 16:
                _context26.prev = 16;

                _iterator4.f();

                return _context26.finish(16);

              case 19:
                _context26.next = 21;
                return this.post(this.baseURL + '/users', {
                  users: userMap
                });

              case 21:
                return _context26.abrupt("return", _context26.sent);

              case 22:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this, [[2, 13, 16, 19]]);
      }));

      function upsertUsers(_x28) {
        return _upsertUsers.apply(this, arguments);
      }

      return upsertUsers;
    }()
    /**
     * @deprecated Please use upsertUsers() function instead.
     *
     * updateUsers - Batch update the list of users
     *
     * @param {UserResponse<UserType>[]} users list of users
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */

  }, {
    key: "upsertUser",
    value:
    /**
     * upsertUser - Update or Create the given user object
     *
     * @param {UserResponse<UserType>} userObject user object, the only required field is the user id. IE {id: "myuser"} is valid
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    function upsertUser(userObject) {
      return this.upsertUsers([userObject]);
    }
    /**
     * @deprecated Please use upsertUser() function instead.
     *
     * updateUser - Update or Create the given user object
     *
     * @param {UserResponse<UserType>} userObject user object, the only required field is the user id. IE {id: "myuser"} is valid
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */

  }, {
    key: "partialUpdateUsers",
    value:
    /**
     * partialUpdateUsers - Batch partial update of users
     *
     * @param {PartialUserUpdate<UserType>[]} users list of partial update requests
     *
     * @return {Promise<APIResponse & { users: { [key: string]: UserResponse<UserType> } }>}
     */
    function () {
      var _partialUpdateUsers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee27(users) {
        var _iterator5, _step5, userObject;

        return _regeneratorRuntime__default['default'].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _iterator5 = _createForOfIteratorHelper(users);
                _context27.prev = 1;

                _iterator5.s();

              case 3:
                if ((_step5 = _iterator5.n()).done) {
                  _context27.next = 9;
                  break;
                }

                userObject = _step5.value;

                if (userObject.id) {
                  _context27.next = 7;
                  break;
                }

                throw Error('User ID is required when updating a user');

              case 7:
                _context27.next = 3;
                break;

              case 9:
                _context27.next = 14;
                break;

              case 11:
                _context27.prev = 11;
                _context27.t0 = _context27["catch"](1);

                _iterator5.e(_context27.t0);

              case 14:
                _context27.prev = 14;

                _iterator5.f();

                return _context27.finish(14);

              case 17:
                _context27.next = 19;
                return this.patch(this.baseURL + '/users', {
                  users: users
                });

              case 19:
                return _context27.abrupt("return", _context27.sent);

              case 20:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this, [[1, 11, 14, 17]]);
      }));

      function partialUpdateUsers(_x29) {
        return _partialUpdateUsers.apply(this, arguments);
      }

      return partialUpdateUsers;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee28(userID, params) {
        return _regeneratorRuntime__default['default'].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return this.delete(this.baseURL + "/users/".concat(userID), params);

              case 2:
                return _context28.abrupt("return", _context28.sent);

              case 3:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function deleteUser(_x30, _x31) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: "reactivateUser",
    value: function () {
      var _reactivateUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee29(userID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return this.post(this.baseURL + "/users/".concat(userID, "/reactivate"), _objectSpread({}, options));

              case 2:
                return _context29.abrupt("return", _context29.sent);

              case 3:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function reactivateUser(_x32, _x33) {
        return _reactivateUser.apply(this, arguments);
      }

      return reactivateUser;
    }()
  }, {
    key: "deactivateUser",
    value: function () {
      var _deactivateUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee30(userID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return this.post(this.baseURL + "/users/".concat(userID, "/deactivate"), _objectSpread({}, options));

              case 2:
                return _context30.abrupt("return", _context30.sent);

              case 3:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function deactivateUser(_x34, _x35) {
        return _deactivateUser.apply(this, arguments);
      }

      return deactivateUser;
    }()
  }, {
    key: "exportUser",
    value: function () {
      var _exportUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee31(userID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return this.get(this.baseURL + "/users/".concat(userID, "/export"), _objectSpread({}, options));

              case 2:
                return _context31.abrupt("return", _context31.sent);

              case 3:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function exportUser(_x36, _x37) {
        return _exportUser.apply(this, arguments);
      }

      return exportUser;
    }()
    /** banUser - bans a user from all channels
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} [options]
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "banUser",
    value: function () {
      var _banUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee32(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _context32.next = 2;
                return this.post(this.baseURL + '/moderation/ban', _objectSpread({
                  target_user_id: targetUserID
                }, options));

              case 2:
                return _context32.abrupt("return", _context32.sent);

              case 3:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function banUser(_x38, _x39) {
        return _banUser.apply(this, arguments);
      }

      return banUser;
    }()
    /** unbanUser - revoke global ban for a user
     *
     * @param {string} targetUserID
     * @param {UnBanUserOptions} [options]
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "unbanUser",
    value: function () {
      var _unbanUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee33(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                _context33.next = 2;
                return this.delete(this.baseURL + '/moderation/ban', _objectSpread({
                  target_user_id: targetUserID
                }, options));

              case 2:
                return _context33.abrupt("return", _context33.sent);

              case 3:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function unbanUser(_x40, _x41) {
        return _unbanUser.apply(this, arguments);
      }

      return unbanUser;
    }()
    /** shadowBan - shadow bans a user from all channels
     *
     * @param {string} targetUserID
     * @param {BanUserOptions<UserType>} [options]
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "shadowBan",
    value: function () {
      var _shadowBan = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee34(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                _context34.next = 2;
                return this.banUser(targetUserID, _objectSpread({
                  shadow: true
                }, options));

              case 2:
                return _context34.abrupt("return", _context34.sent);

              case 3:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function shadowBan(_x42, _x43) {
        return _shadowBan.apply(this, arguments);
      }

      return shadowBan;
    }()
    /** removeShadowBan - revoke global shadow ban for a user
     *
     * @param {string} targetUserID
     * @param {UnBanUserOptions} [options]
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "removeShadowBan",
    value: function () {
      var _removeShadowBan = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee35(targetUserID, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.next = 2;
                return this.unbanUser(targetUserID, _objectSpread({
                  shadow: true
                }, options));

              case 2:
                return _context35.abrupt("return", _context35.sent);

              case 3:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function removeShadowBan(_x44, _x45) {
        return _removeShadowBan.apply(this, arguments);
      }

      return removeShadowBan;
    }()
    /** muteUser - mutes a user
     *
     * @param {string} targetID
     * @param {string} [userID] Only used with serverside auth
     * @param {MuteUserOptions<UserType>} [options]
     * @returns {Promise<MuteUserResponse<ChannelType, CommandType, UserType>>}
     */

  }, {
    key: "muteUser",
    value: function () {
      var _muteUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee36(targetID, userID) {
        var options,
            _args36 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                options = _args36.length > 2 && _args36[2] !== undefined ? _args36[2] : {};
                _context36.next = 3;
                return this.post(this.baseURL + '/moderation/mute', _objectSpread(_objectSpread({
                  target_id: targetID
                }, userID ? {
                  user_id: userID
                } : {}), options));

              case 3:
                return _context36.abrupt("return", _context36.sent);

              case 4:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function muteUser(_x46, _x47) {
        return _muteUser.apply(this, arguments);
      }

      return muteUser;
    }()
    /** unmuteUser - unmutes a user
     *
     * @param {string} targetID
     * @param {string} [currentUserID] Only used with serverside auth
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "unmuteUser",
    value: function () {
      var _unmuteUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee37(targetID, currentUserID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _context37.next = 2;
                return this.post(this.baseURL + '/moderation/unmute', _objectSpread({
                  target_id: targetID
                }, currentUserID ? {
                  user_id: currentUserID
                } : {}));

              case 2:
                return _context37.abrupt("return", _context37.sent);

              case 3:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this);
      }));

      function unmuteUser(_x48, _x49) {
        return _unmuteUser.apply(this, arguments);
      }

      return unmuteUser;
    }()
    /** userMuteStatus - check if a user is muted or not, can be used after connectUser() is called
     *
     * @param {string} targetID
     * @returns {boolean}
     */

  }, {
    key: "userMuteStatus",
    value: function userMuteStatus(targetID) {
      if (!this.user || !this.wsPromise) {
        throw new Error('Make sure to await connectUser() first.');
      }

      for (var i = 0; i < this.mutedUsers.length; i += 1) {
        if (this.mutedUsers[i].target.id === targetID) return true;
      }

      return false;
    }
    /**
     * flagMessage - flag a message
     * @param {string} targetMessageID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "flagMessage",
    value: function () {
      var _flagMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee38(targetMessageID) {
        var options,
            _args38 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                options = _args38.length > 1 && _args38[1] !== undefined ? _args38[1] : {};
                _context38.next = 3;
                return this.post(this.baseURL + '/moderation/flag', _objectSpread({
                  target_message_id: targetMessageID
                }, options));

              case 3:
                return _context38.abrupt("return", _context38.sent);

              case 4:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function flagMessage(_x50) {
        return _flagMessage.apply(this, arguments);
      }

      return flagMessage;
    }()
    /**
     * flagUser - flag a user
     * @param {string} targetID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "flagUser",
    value: function () {
      var _flagUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee39(targetID) {
        var options,
            _args39 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                options = _args39.length > 1 && _args39[1] !== undefined ? _args39[1] : {};
                _context39.next = 3;
                return this.post(this.baseURL + '/moderation/flag', _objectSpread({
                  target_user_id: targetID
                }, options));

              case 3:
                return _context39.abrupt("return", _context39.sent);

              case 4:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function flagUser(_x51) {
        return _flagUser.apply(this, arguments);
      }

      return flagUser;
    }()
    /**
     * unflagMessage - unflag a message
     * @param {string} targetMessageID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "unflagMessage",
    value: function () {
      var _unflagMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee40(targetMessageID) {
        var options,
            _args40 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                options = _args40.length > 1 && _args40[1] !== undefined ? _args40[1] : {};
                _context40.next = 3;
                return this.post(this.baseURL + '/moderation/unflag', _objectSpread({
                  target_message_id: targetMessageID
                }, options));

              case 3:
                return _context40.abrupt("return", _context40.sent);

              case 4:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));

      function unflagMessage(_x52) {
        return _unflagMessage.apply(this, arguments);
      }

      return unflagMessage;
    }()
    /**
     * unflagUser - unflag a user
     * @param {string} targetID
     * @param {string} [options.user_id] currentUserID, only used with serverside auth
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "unflagUser",
    value: function () {
      var _unflagUser = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee41(targetID) {
        var options,
            _args41 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                options = _args41.length > 1 && _args41[1] !== undefined ? _args41[1] : {};
                _context41.next = 3;
                return this.post(this.baseURL + '/moderation/unflag', _objectSpread({
                  target_user_id: targetID
                }, options));

              case 3:
                return _context41.abrupt("return", _context41.sent);

              case 4:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this);
      }));

      function unflagUser(_x53) {
        return _unflagUser.apply(this, arguments);
      }

      return unflagUser;
    }()
    /**
     * @deprecated use markChannelsRead instead
     *
     * markAllRead - marks all channels for this user as read
     * @param {MarkAllReadOptions<UserType>} [data]
     *
     * @return {Promise<APIResponse>}
     */

  }, {
    key: "markChannelsRead",
    value:
    /**
     * markChannelsRead - marks channels read -
     * it accepts a map of cid:messageid pairs, if messageid is empty, the whole channel will be marked as read
     *
     * @param {MarkChannelsReadOptions <UserType>} [data]
     *
     * @return {Promise<APIResponse>}
     */
    function () {
      var _markChannelsRead = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee42() {
        var data,
            _args42 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                data = _args42.length > 0 && _args42[0] !== undefined ? _args42[0] : {};
                _context42.next = 3;
                return this.post(this.baseURL + '/channels/read', _objectSpread({}, data));

              case 3:
              case "end":
                return _context42.stop();
            }
          }
        }, _callee42, this);
      }));

      function markChannelsRead() {
        return _markChannelsRead.apply(this, arguments);
      }

      return markChannelsRead;
    }()
  }, {
    key: "createCommand",
    value: function createCommand(data) {
      return this.post(this.baseURL + '/commands', data);
    }
  }, {
    key: "getCommand",
    value: function getCommand(name) {
      return this.get(this.baseURL + "/commands/".concat(name));
    }
  }, {
    key: "updateCommand",
    value: function updateCommand(name, data) {
      return this.put(this.baseURL + "/commands/".concat(name), data);
    }
  }, {
    key: "deleteCommand",
    value: function deleteCommand(name) {
      return this.delete(this.baseURL + "/commands/".concat(name));
    }
  }, {
    key: "listCommands",
    value: function listCommands() {
      return this.get(this.baseURL + "/commands");
    }
  }, {
    key: "createChannelType",
    value: function createChannelType(data) {
      var channelData = _extends__default['default']({}, {
        commands: ['all']
      }, data);

      return this.post(this.baseURL + '/channeltypes', channelData);
    }
  }, {
    key: "getChannelType",
    value: function getChannelType(channelType) {
      return this.get(this.baseURL + "/channeltypes/".concat(channelType));
    }
  }, {
    key: "updateChannelType",
    value: function updateChannelType(channelType, data) {
      return this.put(this.baseURL + "/channeltypes/".concat(channelType), data);
    }
  }, {
    key: "deleteChannelType",
    value: function deleteChannelType(channelType) {
      return this.delete(this.baseURL + "/channeltypes/".concat(channelType));
    }
  }, {
    key: "listChannelTypes",
    value: function listChannelTypes() {
      return this.get(this.baseURL + "/channeltypes");
    }
    /**
     * translateMessage - adds the translation to the message
     *
     * @param {string} messageId
     * @param {string} language
     *
     * @return {APIResponse & MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>} Response that includes the message
     */

  }, {
    key: "translateMessage",
    value: function () {
      var _translateMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee43(messageId, language) {
        return _regeneratorRuntime__default['default'].wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                _context43.next = 2;
                return this.post(this.baseURL + "/messages/".concat(messageId, "/translate"), {
                  language: language
                });

              case 2:
                return _context43.abrupt("return", _context43.sent);

              case 3:
              case "end":
                return _context43.stop();
            }
          }
        }, _callee43, this);
      }));

      function translateMessage(_x54, _x55) {
        return _translateMessage.apply(this, arguments);
      }

      return translateMessage;
    }()
    /**
     * _normalizeExpiration - transforms expiration value into ISO string
     * @param {undefined|null|number|string|Date} timeoutOrExpirationDate expiration date or timeout. Use number type to set timeout in seconds, string or Date to set exact expiration date
     */

  }, {
    key: "_normalizeExpiration",
    value: function _normalizeExpiration(timeoutOrExpirationDate) {
      var pinExpires;

      if (typeof timeoutOrExpirationDate === 'number') {
        var now = new Date();
        now.setSeconds(now.getSeconds() + timeoutOrExpirationDate);
        pinExpires = now.toISOString();
      } else if (isString(timeoutOrExpirationDate)) {
        pinExpires = timeoutOrExpirationDate;
      } else if (timeoutOrExpirationDate instanceof Date) {
        pinExpires = timeoutOrExpirationDate.toISOString();
      }

      return pinExpires;
    }
    /**
     * _messageId - extracts string message id from either message object or message id
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {string} errorText error message to report in case of message id absence
     */

  }, {
    key: "_validateAndGetMessageId",
    value: function _validateAndGetMessageId(messageOrMessageId, errorText) {
      var messageId;

      if (typeof messageOrMessageId === 'string') {
        messageId = messageOrMessageId;
      } else {
        if (!messageOrMessageId.id) {
          throw Error(errorText);
        }

        messageId = messageOrMessageId.id;
      }

      return messageId;
    }
    /**
     * pinMessage - pins the message
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {undefined|null|number|string|Date} timeoutOrExpirationDate expiration date or timeout. Use number type to set timeout in seconds, string or Date to set exact expiration date
     * @param {string | { id: string }} [userId]
     */

  }, {
    key: "pinMessage",
    value: function pinMessage(messageOrMessageId, timeoutOrExpirationDate, userId) {
      var messageId = this._validateAndGetMessageId(messageOrMessageId, 'Please specify the message id when calling unpinMessage');

      return this.partialUpdateMessage(messageId, {
        set: {
          pinned: true,
          pin_expires: this._normalizeExpiration(timeoutOrExpirationDate)
        }
      }, userId);
    }
    /**
     * unpinMessage - unpins the message that was previously pinned
     * @param {string | { id: string }} messageOrMessageId message object or message id
     * @param {string | { id: string }} [userId]
     */

  }, {
    key: "unpinMessage",
    value: function unpinMessage(messageOrMessageId, userId) {
      var messageId = this._validateAndGetMessageId(messageOrMessageId, 'Please specify the message id when calling unpinMessage');

      return this.partialUpdateMessage(messageId, {
        set: {
          pinned: false
        }
      }, userId);
    }
    /**
     * updateMessage - Update the given message
     *
     * @param {Omit<MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType>, 'mentioned_users'> & { mentioned_users?: string[] }} message object, id needs to be specified
     * @param {string | { id: string }} [userId]
     * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
     *
     * @return {APIResponse & { message: MessageResponse<AttachmentType, ChannelType, CommandType, MessageType, ReactionType, UserType> }} Response that includes the message
     */

  }, {
    key: "updateMessage",
    value: function () {
      var _updateMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee44(message, userId, options) {
        var clonedMessage, reservedMessageFields;
        return _regeneratorRuntime__default['default'].wrap(function _callee44$(_context44) {
          while (1) {
            switch (_context44.prev = _context44.next) {
              case 0:
                if (message.id) {
                  _context44.next = 2;
                  break;
                }

                throw Error('Please specify the message id when calling updateMessage');

              case 2:
                clonedMessage = _extends__default['default']({}, message);
                delete clonedMessage.id;
                reservedMessageFields = ['command', 'created_at', 'html', 'latest_reactions', 'own_reactions', 'quoted_message', 'reaction_counts', 'reply_count', 'type', 'updated_at', 'user', '__html'];
                reservedMessageFields.forEach(function (item) {
                  if (clonedMessage[item] != null) {
                    delete clonedMessage[item];
                  }
                });

                if (userId != null) {
                  if (isString(userId)) {
                    clonedMessage.user_id = userId;
                  } else {
                    clonedMessage.user = {
                      id: userId.id
                    };
                  }
                }
                /**
                 * Server always expects mentioned_users to be array of string. We are adding extra check, just in case
                 * SDK missed this conversion.
                 */


                if (Array.isArray(clonedMessage.mentioned_users) && !isString(clonedMessage.mentioned_users[0])) {
                  clonedMessage.mentioned_users = clonedMessage.mentioned_users.map(function (mu) {
                    return mu.id;
                  });
                }

                _context44.next = 10;
                return this.post(this.baseURL + "/messages/".concat(message.id), _objectSpread({
                  message: clonedMessage
                }, options));

              case 10:
                return _context44.abrupt("return", _context44.sent);

              case 11:
              case "end":
                return _context44.stop();
            }
          }
        }, _callee44, this);
      }));

      function updateMessage(_x56, _x57, _x58) {
        return _updateMessage.apply(this, arguments);
      }

      return updateMessage;
    }()
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

  }, {
    key: "partialUpdateMessage",
    value: function () {
      var _partialUpdateMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee45(id, partialMessageObject, userId, options) {
        var user;
        return _regeneratorRuntime__default['default'].wrap(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                if (id) {
                  _context45.next = 2;
                  break;
                }

                throw Error('Please specify the message id when calling partialUpdateMessage');

              case 2:
                user = userId;

                if (userId != null && isString(userId)) {
                  user = {
                    id: userId
                  };
                }

                _context45.next = 6;
                return this.put(this.baseURL + "/messages/".concat(id), _objectSpread(_objectSpread(_objectSpread({}, partialMessageObject), options), {}, {
                  user: user
                }));

              case 6:
                return _context45.abrupt("return", _context45.sent);

              case 7:
              case "end":
                return _context45.stop();
            }
          }
        }, _callee45, this);
      }));

      function partialUpdateMessage(_x59, _x60, _x61, _x62) {
        return _partialUpdateMessage.apply(this, arguments);
      }

      return partialUpdateMessage;
    }()
  }, {
    key: "deleteMessage",
    value: function () {
      var _deleteMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee46(messageID, hardDelete) {
        var params;
        return _regeneratorRuntime__default['default'].wrap(function _callee46$(_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                params = {};

                if (hardDelete) {
                  params = {
                    hard: true
                  };
                }

                _context46.next = 4;
                return this.delete(this.baseURL + "/messages/".concat(messageID), params);

              case 4:
                return _context46.abrupt("return", _context46.sent);

              case 5:
              case "end":
                return _context46.stop();
            }
          }
        }, _callee46, this);
      }));

      function deleteMessage(_x63, _x64) {
        return _deleteMessage.apply(this, arguments);
      }

      return deleteMessage;
    }()
  }, {
    key: "getMessage",
    value: function () {
      var _getMessage = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee47(messageID) {
        return _regeneratorRuntime__default['default'].wrap(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                _context47.next = 2;
                return this.get(this.baseURL + "/messages/".concat(messageID));

              case 2:
                return _context47.abrupt("return", _context47.sent);

              case 3:
              case "end":
                return _context47.stop();
            }
          }
        }, _callee47, this);
      }));

      function getMessage(_x65) {
        return _getMessage.apply(this, arguments);
      }

      return getMessage;
    }()
  }, {
    key: "getUserAgent",
    value: function getUserAgent() {
      return this.userAgent || "stream-chat-javascript-client-".concat(this.node ? 'node' : 'browser', "-", "5.0.1");
    }
  }, {
    key: "setUserAgent",
    value: function setUserAgent(userAgent) {
      this.userAgent = userAgent;
    }
    /**
     * _isUsingServerAuth - Returns true if we're using server side auth
     */

  }, {
    key: "_enrichAxiosOptions",
    value: function _enrichAxiosOptions() {
      var _options$headers;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        params: {},
        headers: {},
        config: {}
      };

      var token = this._getToken();

      var authorization = token ? {
        Authorization: token
      } : undefined;

      if (!((_options$headers = options.headers) !== null && _options$headers !== void 0 && _options$headers['x-client-request-id'])) {
        options.headers = _objectSpread(_objectSpread({}, options.headers), {}, {
          'x-client-request-id': randomId()
        });
      }

      return _objectSpread({
        params: _objectSpread({
          user_id: this.userID,
          connection_id: this._getConnectionID(),
          api_key: this.key
        }, options.params),
        headers: _objectSpread(_objectSpread({}, authorization), {}, {
          'stream-auth-type': this.getAuthType(),
          'X-Stream-Client': this.getUserAgent()
        }, options.headers)
      }, options.config);
    }
  }, {
    key: "_getToken",
    value: function _getToken() {
      if (!this.tokenManager || this.anonymous) return null;
      return this.tokenManager.getToken();
    }
  }, {
    key: "_startCleaning",
    value: function _startCleaning() {
      var that = this;

      if (this.cleaningIntervalRef != null) {
        return;
      }

      this.cleaningIntervalRef = setInterval(function () {
        // call clean on the channel, used for calling the stop.typing event etc.
        for (var _i3 = 0, _Object$values2 = Object.values(that.activeChannels); _i3 < _Object$values2.length; _i3++) {
          var _channel7 = _Object$values2[_i3];

          _channel7.clean();
        }
      }, 500);
    }
    /**
     * encode ws url payload
     * @private
     * @returns json string
     */

  }, {
    key: "verifyWebhook",
    value: function verifyWebhook(requestBody, xSignature) {
      return !!this.secret && CheckSignature(requestBody, this.secret, xSignature);
    }
    /** getPermission - gets the definition for a permission
     *
     * @param {string} name
     * @returns {Promise<PermissionAPIResponse>}
     */

  }, {
    key: "getPermission",
    value: function getPermission(name) {
      return this.get("".concat(this.baseURL, "/permissions/").concat(name));
    }
    /** createPermission - creates a custom permission
     *
     * @param {CustomPermissionOptions} permissionData the permission data
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "createPermission",
    value: function createPermission(permissionData) {
      return this.post("".concat(this.baseURL, "/permissions"), _objectSpread({}, permissionData));
    }
    /** updatePermission - updates an existing custom permission
     *
     * @param {string} id
     * @param {Omit<CustomPermissionOptions, 'id'>} permissionData the permission data
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "updatePermission",
    value: function updatePermission(id, permissionData) {
      return this.put("".concat(this.baseURL, "/permissions/").concat(id), _objectSpread({}, permissionData));
    }
    /** deletePermission - deletes a custom permission
     *
     * @param {string} name
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "deletePermission",
    value: function deletePermission(name) {
      return this.delete("".concat(this.baseURL, "/permissions/").concat(name));
    }
    /** listPermissions - returns the list of all permissions for this application
     *
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "listPermissions",
    value: function listPermissions() {
      return this.get("".concat(this.baseURL, "/permissions"));
    }
    /** createRole - creates a custom role
     *
     * @param {string} name the new role name
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "createRole",
    value: function createRole(name) {
      return this.post("".concat(this.baseURL, "/roles"), {
        name: name
      });
    }
    /** listRoles - returns the list of all roles for this application
     *
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "listRoles",
    value: function listRoles() {
      return this.get("".concat(this.baseURL, "/roles"));
    }
    /** deleteRole - deletes a custom role
     *
     * @param {string} name the role name
     * @returns {Promise<APIResponse>}
     */

  }, {
    key: "deleteRole",
    value: function deleteRole(name) {
      return this.delete("".concat(this.baseURL, "/roles/").concat(name));
    }
    /** sync - returns all events that happened for a list of channels since last sync
     * @param {string[]} channel_cids list of channel CIDs
     * @param {string} last_sync_at last time the user was online and in sync. RFC3339 ie. "2020-05-06T15:05:01.207Z"
     */

  }, {
    key: "sync",
    value: function sync(channel_cids, last_sync_at) {
      return this.post("".concat(this.baseURL, "/sync"), {
        channel_cids: channel_cids,
        last_sync_at: last_sync_at
      });
    }
    /**
     * sendUserCustomEvent - Send a custom event to a user
     *
     * @param {string} targetUserID target user id
     * @param {UserCustomEvent} event for example {type: 'friendship-request'}
     *
     * @return {Promise<APIResponse>} The Server Response
     */

  }, {
    key: "sendUserCustomEvent",
    value: function () {
      var _sendUserCustomEvent = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee48(targetUserID, event) {
        return _regeneratorRuntime__default['default'].wrap(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                _context48.next = 2;
                return this.post("".concat(this.baseURL, "/users/").concat(targetUserID, "/event"), {
                  event: event
                });

              case 2:
                return _context48.abrupt("return", _context48.sent);

              case 3:
              case "end":
                return _context48.stop();
            }
          }
        }, _callee48, this);
      }));

      function sendUserCustomEvent(_x66, _x67) {
        return _sendUserCustomEvent.apply(this, arguments);
      }

      return sendUserCustomEvent;
    }()
  }, {
    key: "createBlockList",
    value: function createBlockList(blockList) {
      return this.post("".concat(this.baseURL, "/blocklists"), blockList);
    }
  }, {
    key: "listBlockLists",
    value: function listBlockLists() {
      return this.get("".concat(this.baseURL, "/blocklists"));
    }
  }, {
    key: "getBlockList",
    value: function getBlockList(name) {
      return this.get("".concat(this.baseURL, "/blocklists/").concat(name));
    }
  }, {
    key: "updateBlockList",
    value: function updateBlockList(name, data) {
      return this.put("".concat(this.baseURL, "/blocklists/").concat(name), data);
    }
  }, {
    key: "deleteBlockList",
    value: function deleteBlockList(name) {
      return this.delete("".concat(this.baseURL, "/blocklists/").concat(name));
    }
  }, {
    key: "exportChannels",
    value: function exportChannels(request) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var payload = _objectSpread({
        channels: request
      }, options);

      return this.post("".concat(this.baseURL, "/export_channels"), payload);
    }
  }, {
    key: "exportChannel",
    value: function exportChannel(request, options) {
      return this.exportChannels([request], options);
    }
  }, {
    key: "getExportChannelStatus",
    value: function getExportChannelStatus(id) {
      return this.get("".concat(this.baseURL, "/export_channels/").concat(id));
    }
    /**
     * createSegment - Creates a Campaign Segment
     *
     * @param {SegmentData} params Segment data
     *
     * @return {Segment} The Created Segment
     */

  }, {
    key: "createSegment",
    value: function () {
      var _createSegment = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee49(params) {
        var _yield$this$post, segment;

        return _regeneratorRuntime__default['default'].wrap(function _callee49$(_context49) {
          while (1) {
            switch (_context49.prev = _context49.next) {
              case 0:
                _context49.next = 2;
                return this.post(this.baseURL + "/segments", {
                  segment: params
                });

              case 2:
                _yield$this$post = _context49.sent;
                segment = _yield$this$post.segment;
                return _context49.abrupt("return", segment);

              case 5:
              case "end":
                return _context49.stop();
            }
          }
        }, _callee49, this);
      }));

      function createSegment(_x68) {
        return _createSegment.apply(this, arguments);
      }

      return createSegment;
    }()
    /**
     * getSegment - Get a Campaign Segment
     *
     * @param {string} id Segment ID
     *
     * @return {Segment} A Segment
     */

  }, {
    key: "getSegment",
    value: function () {
      var _getSegment = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee50(id) {
        var _yield$this$get, segment;

        return _regeneratorRuntime__default['default'].wrap(function _callee50$(_context50) {
          while (1) {
            switch (_context50.prev = _context50.next) {
              case 0:
                _context50.next = 2;
                return this.get(this.baseURL + "/segments/".concat(id));

              case 2:
                _yield$this$get = _context50.sent;
                segment = _yield$this$get.segment;
                return _context50.abrupt("return", segment);

              case 5:
              case "end":
                return _context50.stop();
            }
          }
        }, _callee50, this);
      }));

      function getSegment(_x69) {
        return _getSegment.apply(this, arguments);
      }

      return getSegment;
    }()
    /**
     * listSegments - List Campaign Segments
     *
     *
     * @return {Segment[]} Segments
     */

  }, {
    key: "listSegments",
    value: function () {
      var _listSegments = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee51(options) {
        var _yield$this$get2, segments;

        return _regeneratorRuntime__default['default'].wrap(function _callee51$(_context51) {
          while (1) {
            switch (_context51.prev = _context51.next) {
              case 0:
                _context51.next = 2;
                return this.get(this.baseURL + "/segments", options);

              case 2:
                _yield$this$get2 = _context51.sent;
                segments = _yield$this$get2.segments;
                return _context51.abrupt("return", segments);

              case 5:
              case "end":
                return _context51.stop();
            }
          }
        }, _callee51, this);
      }));

      function listSegments(_x70) {
        return _listSegments.apply(this, arguments);
      }

      return listSegments;
    }()
    /**
     * updateSegment - Update a Campaign Segment
     *
     * @param {string} id Segment ID
     * @param {Partial<SegmentData>} params Segment data
     *
     * @return {Segment} Updated Segment
     */

  }, {
    key: "updateSegment",
    value: function () {
      var _updateSegment = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee52(id, params) {
        var _yield$this$put, segment;

        return _regeneratorRuntime__default['default'].wrap(function _callee52$(_context52) {
          while (1) {
            switch (_context52.prev = _context52.next) {
              case 0:
                _context52.next = 2;
                return this.put(this.baseURL + "/segments/".concat(id), {
                  segment: params
                });

              case 2:
                _yield$this$put = _context52.sent;
                segment = _yield$this$put.segment;
                return _context52.abrupt("return", segment);

              case 5:
              case "end":
                return _context52.stop();
            }
          }
        }, _callee52, this);
      }));

      function updateSegment(_x71, _x72) {
        return _updateSegment.apply(this, arguments);
      }

      return updateSegment;
    }()
    /**
     * deleteSegment - Delete a Campaign Segment
     *
     * @param {string} id Segment ID
     *
     * @return {Promise<APIResponse>} The Server Response
     */

  }, {
    key: "deleteSegment",
    value: function () {
      var _deleteSegment = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee53(id) {
        return _regeneratorRuntime__default['default'].wrap(function _callee53$(_context53) {
          while (1) {
            switch (_context53.prev = _context53.next) {
              case 0:
                return _context53.abrupt("return", this.delete(this.baseURL + "/segments/".concat(id)));

              case 1:
              case "end":
                return _context53.stop();
            }
          }
        }, _callee53, this);
      }));

      function deleteSegment(_x73) {
        return _deleteSegment.apply(this, arguments);
      }

      return deleteSegment;
    }()
    /**
     * createCampaign - Creates a Campaign
     *
     * @param {CampaignData} params Campaign data
     *
     * @return {Campaign} The Created Campaign
     */

  }, {
    key: "createCampaign",
    value: function () {
      var _createCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee54(params) {
        var _yield$this$post2, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee54$(_context54) {
          while (1) {
            switch (_context54.prev = _context54.next) {
              case 0:
                _context54.next = 2;
                return this.post(this.baseURL + "/campaigns", {
                  campaign: params
                });

              case 2:
                _yield$this$post2 = _context54.sent;
                campaign = _yield$this$post2.campaign;
                return _context54.abrupt("return", campaign);

              case 5:
              case "end":
                return _context54.stop();
            }
          }
        }, _callee54, this);
      }));

      function createCampaign(_x74) {
        return _createCampaign.apply(this, arguments);
      }

      return createCampaign;
    }()
    /**
     * getCampaign - Get a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} A Campaign
     */

  }, {
    key: "getCampaign",
    value: function () {
      var _getCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee55(id) {
        var _yield$this$get3, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee55$(_context55) {
          while (1) {
            switch (_context55.prev = _context55.next) {
              case 0:
                _context55.next = 2;
                return this.get(this.baseURL + "/campaigns/".concat(id));

              case 2:
                _yield$this$get3 = _context55.sent;
                campaign = _yield$this$get3.campaign;
                return _context55.abrupt("return", campaign);

              case 5:
              case "end":
                return _context55.stop();
            }
          }
        }, _callee55, this);
      }));

      function getCampaign(_x75) {
        return _getCampaign.apply(this, arguments);
      }

      return getCampaign;
    }()
    /**
     * listCampaigns - List Campaigns
     *
     *
     * @return {Campaign[]} Campaigns
     */

  }, {
    key: "listCampaigns",
    value: function () {
      var _listCampaigns = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee56(options) {
        var _yield$this$get4, campaigns;

        return _regeneratorRuntime__default['default'].wrap(function _callee56$(_context56) {
          while (1) {
            switch (_context56.prev = _context56.next) {
              case 0:
                _context56.next = 2;
                return this.get(this.baseURL + "/campaigns", options);

              case 2:
                _yield$this$get4 = _context56.sent;
                campaigns = _yield$this$get4.campaigns;
                return _context56.abrupt("return", campaigns);

              case 5:
              case "end":
                return _context56.stop();
            }
          }
        }, _callee56, this);
      }));

      function listCampaigns(_x76) {
        return _listCampaigns.apply(this, arguments);
      }

      return listCampaigns;
    }()
    /**
     * updateCampaign - Update a Campaign
     *
     * @param {string} id Campaign ID
     * @param {Partial<CampaignData>} params Campaign data
     *
     * @return {Campaign} Updated Campaign
     */

  }, {
    key: "updateCampaign",
    value: function () {
      var _updateCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee57(id, params) {
        var _yield$this$put2, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee57$(_context57) {
          while (1) {
            switch (_context57.prev = _context57.next) {
              case 0:
                _context57.next = 2;
                return this.put(this.baseURL + "/campaigns/".concat(id), {
                  campaign: params
                });

              case 2:
                _yield$this$put2 = _context57.sent;
                campaign = _yield$this$put2.campaign;
                return _context57.abrupt("return", campaign);

              case 5:
              case "end":
                return _context57.stop();
            }
          }
        }, _callee57, this);
      }));

      function updateCampaign(_x77, _x78) {
        return _updateCampaign.apply(this, arguments);
      }

      return updateCampaign;
    }()
    /**
     * deleteCampaign - Delete a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Promise<APIResponse>} The Server Response
     */

  }, {
    key: "deleteCampaign",
    value: function () {
      var _deleteCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee58(id) {
        return _regeneratorRuntime__default['default'].wrap(function _callee58$(_context58) {
          while (1) {
            switch (_context58.prev = _context58.next) {
              case 0:
                return _context58.abrupt("return", this.delete(this.baseURL + "/campaigns/".concat(id)));

              case 1:
              case "end":
                return _context58.stop();
            }
          }
        }, _callee58, this);
      }));

      function deleteCampaign(_x79) {
        return _deleteCampaign.apply(this, arguments);
      }

      return deleteCampaign;
    }()
    /**
     * scheduleCampaign - Schedule a Campaign
     *
     * @param {string} id Campaign ID
     * @param {{sendAt: number}} params Schedule params
     *
     * @return {Campaign} Scheduled Campaign
     */

  }, {
    key: "scheduleCampaign",
    value: function () {
      var _scheduleCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee59(id, params) {
        var sendAt, _yield$this$patch, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee59$(_context59) {
          while (1) {
            switch (_context59.prev = _context59.next) {
              case 0:
                sendAt = params.sendAt;
                _context59.next = 3;
                return this.patch(this.baseURL + "/campaigns/".concat(id, "/schedule"), {
                  send_at: sendAt
                });

              case 3:
                _yield$this$patch = _context59.sent;
                campaign = _yield$this$patch.campaign;
                return _context59.abrupt("return", campaign);

              case 6:
              case "end":
                return _context59.stop();
            }
          }
        }, _callee59, this);
      }));

      function scheduleCampaign(_x80, _x81) {
        return _scheduleCampaign.apply(this, arguments);
      }

      return scheduleCampaign;
    }()
    /**
     * stopCampaign - Stop a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} Stopped Campaign
     */

  }, {
    key: "stopCampaign",
    value: function () {
      var _stopCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee60(id) {
        var _yield$this$patch2, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee60$(_context60) {
          while (1) {
            switch (_context60.prev = _context60.next) {
              case 0:
                _context60.next = 2;
                return this.patch(this.baseURL + "/campaigns/".concat(id, "/stop"));

              case 2:
                _yield$this$patch2 = _context60.sent;
                campaign = _yield$this$patch2.campaign;
                return _context60.abrupt("return", campaign);

              case 5:
              case "end":
                return _context60.stop();
            }
          }
        }, _callee60, this);
      }));

      function stopCampaign(_x82) {
        return _stopCampaign.apply(this, arguments);
      }

      return stopCampaign;
    }()
    /**
     * resumeCampaign - Resume a Campaign
     *
     * @param {string} id Campaign ID
     *
     * @return {Campaign} Resumed Campaign
     */

  }, {
    key: "resumeCampaign",
    value: function () {
      var _resumeCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee61(id) {
        var _yield$this$patch3, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee61$(_context61) {
          while (1) {
            switch (_context61.prev = _context61.next) {
              case 0:
                _context61.next = 2;
                return this.patch(this.baseURL + "/campaigns/".concat(id, "/resume"));

              case 2:
                _yield$this$patch3 = _context61.sent;
                campaign = _yield$this$patch3.campaign;
                return _context61.abrupt("return", campaign);

              case 5:
              case "end":
                return _context61.stop();
            }
          }
        }, _callee61, this);
      }));

      function resumeCampaign(_x83) {
        return _resumeCampaign.apply(this, arguments);
      }

      return resumeCampaign;
    }()
    /**
     * testCampaign - Test a Campaign
     *
     * @param {string} id Campaign ID
     * @param {{users: string[]}} params Test params
     * @return {Campaign} Test Campaign
     */

  }, {
    key: "testCampaign",
    value: function () {
      var _testCampaign = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee62(id, params) {
        var users, _yield$this$post3, campaign;

        return _regeneratorRuntime__default['default'].wrap(function _callee62$(_context62) {
          while (1) {
            switch (_context62.prev = _context62.next) {
              case 0:
                users = params.users;
                _context62.next = 3;
                return this.post(this.baseURL + "/campaigns/".concat(id, "/test"), {
                  users: users
                });

              case 3:
                _yield$this$post3 = _context62.sent;
                campaign = _yield$this$post3.campaign;
                return _context62.abrupt("return", campaign);

              case 6:
              case "end":
                return _context62.stop();
            }
          }
        }, _callee62, this);
      }));

      function testCampaign(_x84, _x85) {
        return _testCampaign.apply(this, arguments);
      }

      return testCampaign;
    }()
    /**
     * enrichURL - Get OpenGraph data of the given link
     *
     * @param {string} url link
     * @return {OGAttachment} OG Attachment
     */

  }, {
    key: "enrichURL",
    value: function () {
      var _enrichURL = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee63(url) {
        return _regeneratorRuntime__default['default'].wrap(function _callee63$(_context63) {
          while (1) {
            switch (_context63.prev = _context63.next) {
              case 0:
                return _context63.abrupt("return", this.get(this.baseURL + "/og", {
                  url: url
                }));

              case 1:
              case "end":
                return _context63.stop();
            }
          }
        }, _callee63, this);
      }));

      function enrichURL(_x86) {
        return _enrichURL.apply(this, arguments);
      }

      return enrichURL;
    }()
    /**
     * getTask - Gets status of a long running task
     *
     * @param {string} id Task ID
     *
     * @return {TaskStatus} The task status
     */

  }, {
    key: "getTask",
    value: function () {
      var _getTask = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee64(id) {
        return _regeneratorRuntime__default['default'].wrap(function _callee64$(_context64) {
          while (1) {
            switch (_context64.prev = _context64.next) {
              case 0:
                return _context64.abrupt("return", this.get("".concat(this.baseURL, "/tasks/").concat(id)));

              case 1:
              case "end":
                return _context64.stop();
            }
          }
        }, _callee64, this);
      }));

      function getTask(_x87) {
        return _getTask.apply(this, arguments);
      }

      return getTask;
    }()
    /**
     * deleteChannels - Deletes a list of channel
     *
     * @param {string[]} cids Channel CIDs
     * @param {boolean} [options.hard_delete] Defines if the channel is hard deleted or not
     *
     * @return {DeleteChannelsResponse} Result of the soft deletion, if server-side, it holds the task ID as well
     */

  }, {
    key: "deleteChannels",
    value: function () {
      var _deleteChannels = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee65(cids) {
        var options,
            _args65 = arguments;
        return _regeneratorRuntime__default['default'].wrap(function _callee65$(_context65) {
          while (1) {
            switch (_context65.prev = _context65.next) {
              case 0:
                options = _args65.length > 1 && _args65[1] !== undefined ? _args65[1] : {};
                _context65.next = 3;
                return this.post(this.baseURL + "/channels/delete", _objectSpread({
                  cids: cids
                }, options));

              case 3:
                return _context65.abrupt("return", _context65.sent);

              case 4:
              case "end":
                return _context65.stop();
            }
          }
        }, _callee65, this);
      }));

      function deleteChannels(_x88) {
        return _deleteChannels.apply(this, arguments);
      }

      return deleteChannels;
    }()
    /**
     * deleteUsers - Batch Delete Users
     *
     * @param {string[]} user_ids which users to delete
     * @param {DeleteUserOptions} options Configuration how to delete users
     *
     * @return {APIResponse} A task ID
     */

  }, {
    key: "deleteUsers",
    value: function () {
      var _deleteUsers = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee66(user_ids, options) {
        return _regeneratorRuntime__default['default'].wrap(function _callee66$(_context66) {
          while (1) {
            switch (_context66.prev = _context66.next) {
              case 0:
                if (!((options === null || options === void 0 ? void 0 : options.user) !== 'soft' && (options === null || options === void 0 ? void 0 : options.user) !== 'hard')) {
                  _context66.next = 2;
                  break;
                }

                throw new Error('Invalid delete user options. user must be one of [soft hard]');

              case 2:
                if (!(options.messages !== undefined && options.messages !== 'soft' && options.messages !== 'hard')) {
                  _context66.next = 4;
                  break;
                }

                throw new Error('Invalid delete user options. messages must be one of [soft hard]');

              case 4:
                if (!(options.conversations !== undefined && options.conversations !== 'soft' && options.conversations !== 'hard')) {
                  _context66.next = 6;
                  break;
                }

                throw new Error('Invalid delete user options. conversations must be one of [soft hard]');

              case 6:
                _context66.next = 8;
                return this.post(this.baseURL + "/users/delete", _objectSpread({
                  user_ids: user_ids
                }, options));

              case 8:
                return _context66.abrupt("return", _context66.sent);

              case 9:
              case "end":
                return _context66.stop();
            }
          }
        }, _callee66, this);
      }));

      function deleteUsers(_x89, _x90) {
        return _deleteUsers.apply(this, arguments);
      }

      return deleteUsers;
    }()
  }], [{
    key: "getInstance",
    value: function getInstance(key, secretOrOptions, options) {
      if (!StreamChat._instance) {
        if (typeof secretOrOptions === 'string') {
          StreamChat._instance = new StreamChat(key, secretOrOptions, options);
        } else {
          StreamChat._instance = new StreamChat(key, secretOrOptions);
        }
      }

      return StreamChat._instance;
    }
  }]);

  return StreamChat;
}();

_defineProperty__default['default'](StreamChat, "_instance", void 0);

var Allow = 'Allow';
var Deny = 'Deny';
var AnyResource = ['*'];
var AnyRole = ['*'];
var MaxPriority = 999;
var MinPriority = 1; // deprecated permission object class, you should use the new permission system v2 and use permissions
// defined in BuiltinPermissions to configure your channel types

var Permission = function Permission(name, priority) {
  var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : AnyResource;
  var roles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : AnyRole;
  var owner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Allow;

  _classCallCheck__default['default'](this, Permission);

  _defineProperty__default['default'](this, "name", void 0);

  _defineProperty__default['default'](this, "action", void 0);

  _defineProperty__default['default'](this, "owner", void 0);

  _defineProperty__default['default'](this, "priority", void 0);

  _defineProperty__default['default'](this, "resources", void 0);

  _defineProperty__default['default'](this, "roles", void 0);

  this.name = name;
  this.action = action;
  this.owner = owner;
  this.priority = priority;
  this.resources = resources;
  this.roles = roles;
}; // deprecated

var AllowAll = new Permission('Allow all', MaxPriority, AnyResource, AnyRole, false, Allow); // deprecated

var DenyAll = new Permission('Deny all', MinPriority, AnyResource, AnyRole, false, Deny);
var BuiltinRoles = {
  Admin: 'admin',
  Anonymous: 'anonymous',
  ChannelMember: 'channel_member',
  ChannelModerator: 'channel_moderator',
  Guest: 'guest',
  User: 'user'
};
var BuiltinPermissions = {
  AddLinks: 'Add Links',
  BanUser: 'Ban User',
  CreateChannel: 'Create Channel',
  CreateMessage: 'Create Message',
  CreateReaction: 'Create Reaction',
  DeleteAnyAttachment: 'Delete Any Attachment',
  DeleteAnyChannel: 'Delete Any Channel',
  DeleteAnyMessage: 'Delete Any Message',
  DeleteAnyReaction: 'Delete Any Reaction',
  DeleteOwnAttachment: 'Delete Own Attachment',
  DeleteOwnChannel: 'Delete Own Channel',
  DeleteOwnMessage: 'Delete Own Message',
  DeleteOwnReaction: 'Delete Own Reaction',
  ReadAnyChannel: 'Read Any Channel',
  ReadOwnChannel: 'Read Own Channel',
  RunMessageAction: 'Run Message Action',
  UpdateAnyChannel: 'Update Any Channel',
  UpdateAnyMessage: 'Update Any Message',
  UpdateMembersAnyChannel: 'Update Members Any Channel',
  UpdateMembersOwnChannel: 'Update Members Own Channel',
  UpdateOwnChannel: 'Update Own Channel',
  UpdateOwnMessage: 'Update Own Message',
  UploadAttachment: 'Upload Attachment',
  UseFrozenChannel: 'Send messages and reactions to frozen channels'
};

exports.Allow = Allow;
exports.AllowAll = AllowAll;
exports.AnyResource = AnyResource;
exports.AnyRole = AnyRole;
exports.BuiltinPermissions = BuiltinPermissions;
exports.BuiltinRoles = BuiltinRoles;
exports.Channel = Channel;
exports.ChannelState = ChannelState;
exports.CheckSignature = CheckSignature;
exports.ClientState = ClientState;
exports.Deny = Deny;
exports.DenyAll = DenyAll;
exports.DevToken = DevToken;
exports.EVENT_MAP = EVENT_MAP;
exports.InsightMetrics = InsightMetrics;
exports.JWTServerToken = JWTServerToken;
exports.JWTUserToken = JWTUserToken;
exports.MaxPriority = MaxPriority;
exports.MinPriority = MinPriority;
exports.Permission = Permission;
exports.StableWSConnection = StableWSConnection;
exports.StreamChat = StreamChat;
exports.TokenManager = TokenManager;
exports.UserFromToken = UserFromToken;
exports.buildWsFatalInsight = buildWsFatalInsight;
exports.buildWsSuccessAfterFailureInsight = buildWsSuccessAfterFailureInsight;
exports.chatCodes = chatCodes;
exports.decodeBase64 = decodeBase64;
exports.encodeBase64 = encodeBase64;
exports.isOwnUser = isOwnUser;
exports.isValidEventType = isValidEventType;
exports.logChatPromiseExecution = logChatPromiseExecution;
exports.postInsights = postInsights;
//# sourceMappingURL=browser.js.map
