import axios, { AxiosRequestConfig, Canceler } from 'axios';
import { StreamChat } from './client';
import { ConnectionOpen, Event, UnknownType } from './types';

enum ConnectionState {
  Closed = 'CLOSED',
  Connected = 'CONNECTED',
  Connecting = 'CONNECTING',
  Disconnectted = 'DISCONNECTTED',
  Init = 'INIT',
}

export class WSConnectionFallback {
  client: StreamChat;
  state: ConnectionState;
  cancel?: Canceler;

  constructor({ client }: { client: StreamChat }) {
    this.client = client;
    this.state = ConnectionState.Init;
  }

  _newCancelToken = () => new axios.CancelToken((cancel) => (this.cancel = cancel));

  _req<T>(params: UnknownType, config: AxiosRequestConfig) {
    return this.client.doAxiosRequest<T>(
      'get',
      this.client.baseURL + '/longpoll',
      undefined,
      {
        cancelToken: this._newCancelToken(),
        config,
        params,
      },
    );
  }

  _poll = async (connection_id: string) => {
    while (this.state === ConnectionState.Connected) {
      try {
        const data = await this._req<{ events: Event[] }>(
          { connection_id },
          { timeout: 30000 }, // 30s
        );

        if (data?.events?.length) {
          for (let i = 0; i < data.events.length; i++) {
            this.client.dispatchEvent(data.events[i]);
          }
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error(err);
        // TODO: handle consequent failures
        //TODO: check for error.code 46 and reset the client, for random failures fallback to loop
      }
    }
  };

  connect = async (jsonPayload: string) => {
    if (this.state === ConnectionState.Connecting) {
      throw new Error('connecting already in progress');
    }
    if (this.state === ConnectionState.Connected) {
      throw new Error('already connected and polling');
    }

    this.state = ConnectionState.Connecting;

    try {
      const { event } = await this._req<{ event: ConnectionOpen<UnknownType> }>(
        { json: jsonPayload },
        { timeout: 10000 }, // 10s
      );

      this.state = ConnectionState.Connected;
      this._poll(event.connection_id).then();
      return event;
    } catch (err) {
      this.state = ConnectionState.Closed;
      return err;
    }
  };

  disconnect = () => {
    this.state = ConnectionState.Disconnectted;
    if (this.cancel) {
      this.cancel('client.disconnect() is called');
    }
  };
}