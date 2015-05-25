// Generated by CoffeeScript 1.9.2
(function() {
  describe('Hangout Connection App', function() {
    beforeEach(function() {
      var state;
      state = {};
      window.gadgets = {
        util: {
          registerOnLoadHandler: function() {}
        }
      };
      this.hangout = {
        data: {
          getValue: function(key) {
            return state[key];
          },
          setValue: function(key, value) {
            return state[key] = value;
          }
        },
        hideApp: function() {},
        onParticipantsChanged: {
          add: function() {}
        },
        onApiReady: {
          add: function() {}
        },
        onair: {
          onBroadcastingChanged: {
            add: function() {}
          }
        }
      };
      window.gapi = {
        hangout: this.hangout
      };
      setFixtures(sandbox({
        'class': 'controls__status'
      }));
      return window.gapi.hangout.data.setValue('updated', 'false');
    });
    describe('constructor', function() {
      return it('add callback on constructor', function() {
        spyOn(gapi.hangout.onApiReady, 'add');
        new HangoutApplication();
        return expect(gapi.hangout.onApiReady.add).toHaveBeenCalled();
      });
    });
    describe('initialize', function() {
      beforeEach(function() {
        this.app = new HangoutApplication();
        spyOn(this.app, 'sendUrl');
        spyOn(gapi.hangout.onParticipantsChanged, 'add');
        return this.jQuerySpy = spyOn(jQuery.fn, 'click');
      });
      afterEach(function() {
        return gapi.hangout.data.setValue('updated', 'false');
      });
      it('runs sendUrl() on start if not yet updated', function() {
        gapi.hangout.data.setValue('updated', void 0);
        this.app.initialize();
        return expect(this.app.sendUrl).toHaveBeenCalledWith(true);
      });
      it('does not run sendUrl() on start if already updated', function() {
        gapi.hangout.data.setValue('updated', 'true');
        this.app.initialize();
        return expect(this.app.sendUrl).not.toHaveBeenCalledWith(true);
      });
      return it('sets refresh interval', function() {
        spyOn(window, 'setInterval');
        this.app.initialize();
        return expect(window.setInterval).toHaveBeenCalledWith(this.app.sendUrl, 120000);
      });
    });
    return describe('sendUrl', function() {
      beforeEach(function() {
        this.app = new HangoutApplication();
        spyOn(jQuery, 'ajax');
        return $.extend(this.hangout, {
          getStartData: function() {
            return JSON.stringify({
              title: 'Topic',
              projectId: 'project_id',
              eventId: 'event_id',
              category: 'category',
              hostId: 'host_id',
              hangoutId: 'hangout_id',
              callbackUrl: '//test.com/'
            });
          },
          getHangoutUrl: function() {
            return 'https://hangouts.com/4';
          },
          getParticipants: function() {
            return {};
          },
          onair: {
            getYouTubeLiveId: function() {
              return '456IDF65';
            },
            isBroadcasting: function() {
              return true;
            }
          },
          layout: {
            displayNotice: function() {}
          }
        });
      });
      it('makes request to WSO with correct params', function() {
        this.app.sendUrl(true);
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          url: '//test.com/hangout_id'
        }));
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          dataType: 'text'
        }));
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'PUT'
        }));
        return expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          data: {
            title: 'Topic',
            project_id: 'project_id',
            event_id: 'event_id',
            category: 'category',
            host_id: 'host_id',
            participants: {},
            hangout_url: 'https://hangouts.com/4',
            yt_video_id: '456IDF65',
            notify: true
          }
        }));
      });
      it('updates connection status to ok', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.success();
        });
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('status')).toEqual('ok');
        return expect($('.controls__status')).toHaveClass('controls__status--ok');
      });
      it('displays notice and sets uptade flag after update', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.success();
        });
        spyOn(this.hangout.layout, 'displayNotice');
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('updated')).toEqual('true');
        return expect(this.hangout.layout.displayNotice).toHaveBeenCalled();
      });
      it('updates connection satus to error on failure', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.error();
        });
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('status')).toEqual('error');
        return expect($('.controls__status')).toHaveClass('controls__status--error');
      });
      return it('makes request to WSO with correct params if callbackUrl in v0 format', function() {
        this.hangout.getStartData = function() {
          return 'https://hangouts.com/id';
        };
        this.app.sendUrl();
        return expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          data: {
            title: void 0,
            project_id: void 0,
            event_id: void 0,
            category: void 0,
            host_id: void 0,
            participants: {},
            hangout_url: 'https://hangouts.com/4',
            yt_video_id: '456IDF65',
            notify: void 0
          }
        }));
      });
    });
  });

}).call(this);
