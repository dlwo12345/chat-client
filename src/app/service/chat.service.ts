import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.socketPath);
  }


  /**
   * 채팅 send
   * @param msg 
   */
  sendMessage(msg: string) {
    this.socket.emit('sendMessage', { msg });
  }

  /**
   * 채팅 소켓 연결
   * socket event name: sendMessage
   */
  onNewMessage(): Observable<any> {
    return Observable.create(observer => {
      // 입장 이벤트
      this.socket.on('connection', msg => {
        observer.next(msg);
      });
      // 메세지 전송 이벤트
      this.socket.on('sendMessage', msg => {
        observer.next(msg);
      });
    });
  }

}
