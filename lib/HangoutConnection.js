// Generated by CoffeeScript 1.9.2
(function() {
  var HangoutApplication, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HangoutApplication = (function() {
    function HangoutApplication() {
      this.sendUrl = bind(this.sendUrl, this);
      this.changeHoaStatus = bind(this.changeHoaStatus, this);
      this.initialize = bind(this.initialize, this);
      gapi.hangout.onApiReady.add((function(_this) {
        return function(eventObj) {
          if (eventObj.isApiReady) {
            _this.initialize();
            return gapi.hangout.onair.onBroadcastingChanged.add(_this.changeHoaStatus);
          }
        };
      })(this));
    }

    HangoutApplication.prototype.initialize = function() {
      if (gapi.hangout.data.getValue('updated') !== 'true') {
        $('button#update').click((function(_this) {
          return function() {
            return _this.sendUrl();
          };
        })(this));
        $('button#notify').click((function(_this) {
          return function() {
            return _this.sendUrl(true);
          };
        })(this));
        $('button#hide').click(gapi.hangout.hideApp);
        (new window.Timer).init();
        this.hoa_status = 'started';
        this.sendUrl(true);
        return this.interval = setInterval(this.sendUrl, 120000);
      } else {
        return $('.controls__status').removeClass('controls__status--ok controls__status--error').addClass("controls__status--" + (gapi.hangout.data.getValue('status')));
      }
    };

    HangoutApplication.prototype.changeHoaStatus = function(e) {
      var prev_hoa_status;
      prev_hoa_status = this.hoa_status;
      this.hoa_status = e.isBroadcasting && prev_hoa_status === 'started' ? 'broadcasting' : !e.isBroadcasting && prev_hoa_status === 'broadcasting' ? 'finished' : prev_hoa_status;
      if (prev_hoa_status !== this.hoa_status) {
        this.sendUrl();
        if (this.hoa_status === 'finished') {
          return clearInterval(this.interval);
        }
      }
    };

    HangoutApplication.prototype.sendUrl = function(notify) {
      var callbackUrl, hangoutUrl, hoa_status, isBroadcasting, participants, startData, youTubeLiveId;
      startData = JSON.parse(gapi.hangout.getStartData());
      callbackUrl = 'https://websiteone-production.herokuapp.com/hangouts/' + startData.hangoutId;
      hangoutUrl = gapi.hangout.getHangoutUrl();
      youTubeLiveId = gapi.hangout.onair.getYouTubeLiveId();
      participants = gapi.hangout.getParticipants();
      isBroadcasting = gapi.hangout.onair.isBroadcasting();
      hoa_status = this.hoa_status;
      return $.ajax({
        url: callbackUrl,
        dataType: 'text',
        type: 'PUT',
        data: {
          title: startData.title,
          project_id: startData.projectId,
          event_id: startData.eventId,
          category: startData.category,
          host_id: startData.hostId,
          participants: participants,
          hangout_url: hangoutUrl,
          yt_video_id: youTubeLiveId,
          hoa_status: hoa_status,
          notify: notify
        },
        success: function() {
          gapi.hangout.data.setValue('status', 'ok');
          if (gapi.hangout.data.getValue('updated') !== 'true') {
            gapi.hangout.layout.displayNotice('Connection to WebsiteOne established');
            gapi.hangout.data.setValue('updated', 'true');
          }
          return $('.controls__status').removeClass('controls__status--error').addClass('controls__status--ok');
        },
        error: function() {
          gapi.hangout.data.setValue('status', 'error');
          return $('.controls__status').removeClass('controls__status--ok controls__status--error').addClass('controls__status--error');
        }
      });
    };

    return HangoutApplication;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.HangoutApplication = HangoutApplication;

  if (typeof gadgets !== "undefined" && gadgets !== null) {
    gadgets.util.registerOnLoadHandler(new HangoutApplication());
  }

}).call(this);
