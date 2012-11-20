
// global var
var speedtest = {};

/////////////////////////////////////////////////////////////////////////////
// functions

speedtest.log = function() {
  var starttime, lastmsg;

  starttime = +new Date();

  function timeDelta() {
    // unit of time is seconds
    return ( ( +new Date() - starttime ) / 1000 ).toFixed(3);
  }

  // a div w/ id 'logger' must exist on the page
  //$( '#logger' ).addClass( 'logdiv' );
  $( '#logger' ).addClass( 'well' );

  // set 'lastmsg' in 'log' w/ first log message
  var lastmsg = $( '<div class="logmsg">[ ' +
                   timeDelta() +
                   '] <span class="dbg-f">Logging started ...</span></div>' );

  $( '#logger' ).append( lastmsg );

  return function ( msg, type ) {
      var logentry;

      if ( type === 'fine' ) {
        // gray font color
        logentry = $( '<div class="logmsg">[ ' +
                      timeDelta() +
                      '] <span class="dbg-f">' + msg + '</span></div>' );
        } else {
          // normal font color
          logentry = $( '<div class="logmsg">[ ' +
                        timeDelta() + '] ' + msg + '</div>' );
        }
        logentry.insertAfter( lastmsg );
        lastmsg = logentry;
  };
}();
// shorthand
var log = speedtest.log;


speedtest.test = function() {
  var max_iterations = 10;
  var test_iterations = 0;
  var test_starttime;
  var test_duration = 0;
  var test_number = 0;
  var test_speed;

  var tests =
    [{urlpart: '/bwtest_images/connection_test/', size: 1, label: '1KB'},
     {urlpart: '/bwtest_images/50KB/',  size: 50,  label: '50KB'},
     {urlpart: '/bwtest_images/100KB/', size: 100, label: '100KB'},
     {urlpart: '/bwtest_images/256KB/', size: 256, label: '256KB'},
     {urlpart: '/bwtest_images/512KB/', size: 512, label: '512KB'},
     {urlpart: '/bwtest_images/1MB/',   size: 1 * 1024,  label: '1MB'},
     {urlpart: '/bwtest_images/2MB/',   size: 2 * 1024,  label: '2MB'},
     {urlpart: '/bwtest_images/5MB/',   size: 5 * 1024,  label: '5MB'},
     {urlpart: '/bwtest_images/10MB/',  size: 10 * 1024, label: '10MB'},
     {urlpart: '/bwtest_images/25MB/',  size: 25 * 1024, label: '25MB'},
     {urlpart: '/bwtest_images/50MB/',  size: 50 * 1024, label: '50MB'},
     {urlpart: '/bwtest_images/84MB/',  size: 84 * 1024, label: '84MB'}];

  // cache busting id
  function uid() {
    return +new Date();
  }

  // addition w/ bounds checking on 'test_number'
  function incr_test_num( val ) {
    var max_value = 11;
    var temp = test_number;
    temp = temp + val;
    if ( temp > max_value ) {
      temp = max_value;
    }
    test_number = temp;
    return;
  }

  function async_retest() {
    test_iterations = test_iterations + 1;

    if ( test_iterations >= max_iterations ) {
      log( 'error: maximum number of tests have been run - stopping tests' );
      return;
    } else {
      // use test_duration to find out which test to do next
      if ( test_duration <= 0 ) {
        // make the next test the one for basic connectivity
        test_number = 0;
        test_duration = 0;
      } else if ( test_duration < 2 ) {
        // the last test was too quick - move up two spots
        incr_test_num( 2 );
      } else if ( test_duration < 5 ) {
        // the last test was too quick - move up one spot
        incr_test_num( 1 );
      } else {
        // test duration was of sufficient length; report speed
        test_speed = ( ( ( tests[test_number].size / 1024 ) / test_duration) * 8 * 1.03).toFixed(2);
        log( 'testing finished: download speed was ' + test_speed + ' Mbps' );
        $( '#results-col-A' ).html( 'Download<br>Results:' )
        $( '#results-col-B' ).text( test_speed )
        $( '#results-col-C' ).text( 'Mbps' )
        
        // update global value that indicates testing is done - manipulating
        //   global state like this seems bad; begs for functional approach
        speedtest.test_in_progress = false;
        
        // reset the following for subsequent tests
        test_iterations = 0;
        test_duration = 0;
        test_number = 0;

        return;
      }
    }

    // basic bounds checking on test_number
    $.ajax({
      url: tests[test_number]['urlpart'] + uid(),
      dataType: 'text',
      beforeSend: function () {
        log( 'starting ' + tests[test_number]['label'] + ' test' );
        test_starttime = +new Date();
      },
      success: function() {
        test_duration = (+new Date() - test_starttime) / 1000;
        log( tests[test_number]['label'] + ' test took ' + test_duration + ' seconds.' );
      },
     error: function( xhr, status ) {
        test_duration = -1;
        log( 'error with ' + tests[test_number]['label'] + ' test' );
      },
      complete: function( xhr, status ) {
        log('----');
        // creates a loop by calling itself
        // This is a kludge.  By the time the timeout is called below, this
        //   function will have been assigned to speedtest.async_retest
        window.setTimeout("speedtest.async_retest()", 10);
      }
    });
  }

  // kludge: modifying a global variable, as described above
  speedtest.async_retest = async_retest;

  return async_retest;

}();


//speedtest.test = function() {
//  log('speedtest.test was called');
//  window.setTimeout("speedtest.test_in_progress = false; log('button re-enabled')", 5000);
//}


speedtest.test_anim_first_run = function() {
  // check for repeated clicks of the testing button
  if ( speedtest.test_in_progress === true ) {
    return;
  }
  speedtest.test_in_progress = true;
  $( '#btn-run' ).unbind( 'click' );
  
  // queue up the button animation and actual bandwidth test
  window.setTimeout( "speedtest.async_test_anim()", 1 );
  window.setTimeout( "speedtest.test()", 1 );

  // fix the size of the current hero div
  $( '#hero' ).width( $( '#hero' ).width() );
  $( '#hero' ).height( $( '#hero' ).height() );
  
  // find positions of the two containers and move B to A
  var offA = $( '#container-A' ).offset();
  var offB = $( '#container-B' ).offset();
  $( '#container-B' ).css( 'position', 'absolute' )
                     .css( 'top', offB.top )
                     .css( 'left', offB.left );
  $( '#container-B' ).animate(
      { top: offA.top - 10 },
      'slow',
      function() { window.setTimeout( "$( '#container-B' ).css( 'position', '' ).css( 'top', '').css( 'left', '')", 1000); } );
  $( '#container-A' ).fadeOut( 'normal' );
};


speedtest.test_anim_subsequent = function() {
  // check for repeated clicks of the testing button
  if ( speedtest.test_in_progress === true ) {
    return;
  }
  speedtest.test_in_progress = true;
  $( '#btn-run' ).unbind( 'click' );
  
  // queue up the button animation and actual bandwidth test
  window.setTimeout( "speedtest.async_test_anim()", 1 );
  window.setTimeout( "speedtest.test()", 1 );

  // reset the test results display
  $( '#results-col-B' ).text( '-.--' )
};


speedtest.async_test_anim = function( num ) {
  var step, nextstep;

  if ( !num ) {
    step = 0;
  } else {
    step = num % 4;
  }
  nextstep = step + 1;

  switch( step ) {
    case 0:
      $('#btn-run').text('Running ...')
      break;
    case 1:
      $('#btn-run').text('Running ')
      break;
    case 2:
      $('#btn-run').text('Running . ')
      break;
    case 3:
      $('#btn-run').text('Running .. ')
      break;
  }
  
  if ( speedtest.test_in_progress == true ) {
    window.setTimeout( "speedtest.async_test_anim(" + nextstep + ")", 1000 );
  } else {
    $( '#btn-run' ).text( 'Test Finished' );
    window.setTimeout( "speedtest.reset_test_button()", 2000 );
  }
};

speedtest.reset_test_button = function() {
  $( '#btn-run' ).html( 'Run Again &#8618;' );
  $( '#btn-run' ).click( speedtest.test_anim_subsequent );
}



/////////////////////////////////////////////////////////////////////////////

$(function() {

  $( '#btn-run' ).click( speedtest.test_anim_first_run );

  // there's a problem w/ displaying, e.g. 3.01
  // set up logging so that it start when test starts, or creates title then logs
  // change logger so it doesn't do as much client side DOM manipulation
});






