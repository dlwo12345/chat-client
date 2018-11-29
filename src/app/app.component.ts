import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './service/chat.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  msgInput: string = '';
  msgArr: any = [];

  chatForm: FormGroup;
  myId: string;

  socketSub: Subscription;

  @ViewChild('chatWindow') chatWindowEl: ElementRef;

  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder,
  ) {
    this.chatForm = this.formBuilder.group({
      msgInput: ['', Validators.required]
    });
  }

  ngOnInit() {
    // 채팅 소켓 연결
    this.socketSub = this.chatService.onNewMessage().subscribe(msg => {
      if (msg.event === 'connection') {
        this.myId = msg.userId;
      }

      this.msgArr.push(msg);
      this.moveChatScrollBottom();
    });
  }

  ngOnDestroy() {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }
  }

  /**
   * 채팅창 스크롤 하단으로 이동
   */
  moveChatScrollBottom() {
    // 비동기 타이밍 맞추기 위해 setTimeout 설정
    setTimeout(() => {
      const chatEl = this.chatWindowEl.nativeElement;
      chatEl.scrollTop = chatEl.scrollHeight - chatEl.clientHeight;
    }, 0);
  }

  sendButtonClick() {
    if (!this.chatForm.valid) {
      return;
    }
    this.chatService.sendMessage(this.chatForm.get('msgInput').value);

    this.msgArr.push({
      type: 'myMessage',
      msg: this.chatForm.get('msgInput').value
    });
    this.moveChatScrollBottom();

    this.chatForm.get('msgInput').patchValue('');
  }
}
