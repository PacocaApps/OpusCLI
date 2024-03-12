/*
 This demonstrates a very basic app launcher (home screen).
 You can set this app as your home screen by adding the
 homeScreen=true option to your build.json file.
*/
    var kbh = app.GetKeyboardHeight() / app.GetDisplayHeight()

var list;
//Called when application is started.
function OnStart()
{ 
    
    _AddPermissions("QUERY_ALL_PACKAGES")
    //Lock screen orientation to Portrait.
    app.SetOrientation( "Portrait" )
    
	//Create the main layout with background image.
	lay = app.CreateLayout( "linear", "XCenter,FillXY" )	
	lay.SetBackColor( "black" )

    //Create a full screen scroller.
    scroller = app.CreateScroller( 1.0, 0.13 )
    lay.AddChild( scroller )
    	
    //Display all activity icons.
    DisplayIcons( scroller )
    
    
    scroll = app.CreateScroller( 0.95, 0.8 )
    scroll.SetBackColor( "black" )
    lay.AddChild( scroll )
    
    txt = app.CreateText( "", 2,-1, "Log,Monospace" )
	txt.SetBackColor( "black" )
	txt.SetLog( 500 )
	scroll.AddChild( txt )
	
	edt = app.CreateTextEdit( "", 0.95, -1, "SingleLine" )
    edt.SetMargins( 0,0,0,0,"dip" )
    edt.SetBackColor( "black" )
    edt.SetOnEnter( edt_OnEnter )
    edt.SetHint( ">" )
    lay.AddChild( edt )

    app.SetScreenMode( "Full" );

    
    
    sys = app.CreateSysProc( "su" )
	sys.SetOnInput( sys_OnInput )
	sys.SetOnError( sys_OnError )
	app.SetOnShowKeyboard( app_OnShowKeyBoard )
	setTimeout( edt_OnEnter, 1000 )

	//Add layout to app.	
	app.AddLayout( lay )
	
	app

	CreateDrawer()
	
	//Add main layout and drawer to app.	
	app.AddDrawer( drawerScroll, "Left", drawerWidth )

	
}

function PermissionResult( ungranted )
{
    alert( "ungranted: " + ungranted );
}





function edt_OnEnter()
{
    var cmd = edt.GetText()
    
    //Add command to log window.
    txt.Log( cmd+"\n", "Green" )
    
    
      for(let i = 0; i < list.length;i++){
           if(cmd === list[i].label){
                        
                        
            txt.Log("Opening: "+list[i].label)
             var action = "android.intent.action.MAIN";
            app.SendIntent( list[i].packageName, list[i].className, action ) 

            }
    
    
         }
   
    
    
    
       

    switch (cmd) {
  case 'clear':
    txt.Log("","Clear" )
    break;
  case 'apps':
      txt.Log( "Total Apps: " + list.length ,"Blue")
      for(let i = 0; i < list.length;i++){
         txt.Log(list[i].label)
         }
         break;
  case 'update':
          DisplayIcons( scroller )
        break;
  case 'help':
           txt.Log("Nigga")
        break;
  case 'update':
          DisplayIcons( scroller )
        break;
  default:
        sys.Out( cmd+"\n" );

}
    
    
    
    
    
    
    
    //Send command to output stream.
    
    edt.SetText("")











}

function app_OnShowKeyBoard( shown )
{
    //Get fractional height of keyboard.
    if( shown ) scroll.SetSize( 0.95, 0.73-kbh )
    else scroll.SetSize( 0.95, 0.75)
    Scroll()
}





function Scroll()
{
    scroll.ScrollTo( 0, 999 )
}




function sys_OnError( data )
{
    //Write data to log.
    txt.Log( data, "Red" )
 
    //Scroll to bottom if lines added.
    setTimeout( Scroll, 100 )
}




function sys_OnInput( data )
{
    //Write data to log.
    txt.Log( data )
 
    //Scroll to bottom if lines added.
    setTimeout( Scroll, 100 )
}










//Create the drawer contents.
function CreateDrawer()
{
    //Create a layout for the drawer.
	//(Here we also put it inside a scroller to allow for long menus)
	drawerWidth = 0.75;
    drawerScroll = app.CreateScroller( drawerWidth, -1, "FillY" )
    drawerScroll.SetBackColor( "White" )
	layDrawer = app.CreateLayout( "Linear", "Left" )
	drawerScroll.AddChild( layDrawer )
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Absolute" )
	layDrawerTop.SetBackground( "/Sys/Img/GreenBack.jpg" )
	layDrawerTop.SetSize( drawerWidth, 0.12 )
	layDrawer.AddChild( layDrawerTop )
	
	//Add an icon to top layout.
	var img = app.CreateImage( "/Sys/Img/Icon.png", 0.15 )
	img.SetPosition( drawerWidth*0.06, 0.03 )
	layDrawerTop.AddChild( img )
	
	//Add user name to top layout.
	var txtUser = app.CreateText( "OpusCLI",-1,-1,"Bold")
	txtUser.SetPosition( drawerWidth*0.29, 0.050)
	txtUser.SetTextColor( "White" )
	txtUser.SetTextSize( 20.7, "dip" )
	layDrawerTop.AddChild( txtUser )
	

	//Create menu layout.
	var layMenu = app.CreateLayout( "Linear", "Left" )
	layDrawer.AddChild( layMenu )
	
    //Add a list to menu layout (with the menu style option).
    var listItems = "Primary::[fa-home],Social::[fa-users],Promotions::[fa-tag],Starred::[fa-star],Important::[fa-flag],Settings::[fa-cog]";
    lstMenu1 = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" )
    lstMenu1.SetColumnWidths( -1, 0.35, 0.18 )
    lstMenu1.SelectItemByIndex( 0, true )
    lstMenu1.SetItemByIndex( 0, "Primary", 21 )
    lstMenu1.SetOnTouch( lstMenu_OnTouch )
    layMenu.AddChild( lstMenu1 )
    
    //Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 )
    sep.SetSize( -1, 1, "px" )
    sep.SetColor( "#cccccc" )
    layMenu.AddChild( sep )
    
    
	
}

















//Handle menu item selection.
function lstMenu_OnTouch( title, body, type, index )
{
    //Close the drawer.
    app.CloseDrawer( "Left" )
    
    //Highlight the chosen menu item in the appropriate list.
    if( this==lstMenu1 ) lstMenu2.SelectItemByIndex(-1)
    else lstMenu1.SelectItemByIndex(-1)
    this.SelectItemByIndex( index, true )
    
    app.ShowPopup( title )
}




//Called when a drawer is opened or closed.
function OnDrawer( side, state )
{
    console.log( side + " : " + state )
}

//Called when hardware menu key pressed.
function OnMenu( name )
{  
   app.OpenDrawer()
}














//Draw the icons
function DisplayIcons( lay )
{
    app.ShowProgress()
 //   list = app.GetInstalledApps()
  //  alert(list[1].packageName)
    list = app.GetActivities()
   // app.Alert(list.length)
    
    
    
    
    
    
    
    
    
    
    //Switch off debugging for max speed.
    app.SetDebugEnabled( false )
    var iconsPerRow = list.length;
    var iconW = 0.6/6 //(iconsPerRow)
    //Create a layout to contain icons.
    layIcons = app.CreateLayout( "Linear", "Horizontal")
    layIcons.SetSize(iconsPerRow/6 ,-1 )
    lay.AddChild( layIcons )
   
    //Get a list of launchable app activities.
    
    //Set icons per row count.
    
     
    //Create an icon for each activity.
    for( var i=0; i<list.length; i++ )
    {
        //Get activity info.
        var a = list[i];
	    //console.log( a.label )
	    
        //Create horizontal layout for rows.
//if( i%iconsPerRow==0 ) {
            var layIconsHoriz = app.CreateLayout( "Linear", "Horizontal" )
            layIcons.AddChild( layIconsHoriz )
//}
        
        
        if(a.className != null){
        
        
        
        
        //Create layout to wrap icon and text.
        var layIcon = app.CreateLayout( "Linear", "Vertical" )
        layIcon.SetMargins( 0.738/iconsPerRow, 0.015, 0.638/iconsPerRow, 0 )
        layIconsHoriz.AddChild( layIcon )
       
        //Load icon image and set touch callbacks.
        var imgIcon = app.CreateImage( a.packageName+"/"+a.className,iconW,-1,"Icon" )
        imgIcon.SetOnTouchDown( img_OnTouchDown )
        imgIcon.SetOnTouchUp( img_OnTouchUp )
        imgIcon.SetOnLongTouch( img_OnLongTouch )
        layIcon.AddChild( imgIcon )
        
        //Store activity info and icon layout in image object for convenience.
        imgIcon.label = a.label;
        imgIcon.packageName = a.packageName;
        imgIcon.className = a.className;
        imgIcon.layIcon = layIcon;
        
        //Create text label.
        var txtIcon = app.CreateText( a.label, iconW*1.5,-1, "Multiline" )
        txtIcon.SetTextSize( 14 )
        txtIcon.SetTextColor( "#ffeeeeee" )
        layIcon.AddChild( txtIcon )
        }else{
        app.Alert( "inavlod app" )
        }
    }
    
    app.SetDebugEnabled( true )
    app.HideProgress()
}



//Destroy and redraw all icons.
function RedrawIcons()
{
    scroller.DestroyChild( layIcons )
    DisplayIcons( scroller )
}

//Handle icon touch down.
function img_OnTouchDown()
{
    //Shrink and fade icon.
    this.Scale( 0.95, 0.95 )
    this.SetAlpha( 0.7 )
}

//Handle icon touch up.
function img_OnTouchUp()
{
    //Restore icon appearance.
    this.Scale( 1, 1 )
    this.SetAlpha( 1 )
    
    //Launch activity.
    var action = "android.intent.action.MAIN";
    app.SendIntent( this.packageName, this.className, action ) 
}

//Handle icon long touch.
function img_OnLongTouch()
{
    //Restore icon appearance.
    this.Scale( 1, 1 )
    this.SetAlpha( 1 )
    
    //Store current icon.
    curIcon = this;
    
    //Show options dialog.
    var list = "Remove,Uninstall,Info";
    lstOps = app.CreateListDialog( "", list, "AutoCancel" )
    lstOps.SetOnTouch( lstOps_Select ) 
    lstOps.Show()
}

//Called when icon long click option chosen.
function lstOps_Select( item )
{
    if( item=="Remove" )
    {
        curIcon.layIcon.SetVisibility( "Gone" )
    }
    else if( item=="Info" )
    {
        var msg = "Name: " + curIcon.label + 
            "\n\nPackage Name: " + curIcon.packageName + 
            "\n\nClass Name: " + curIcon.className;
        app.Alert( msg, "App Info" )
    }
    else if( item=="Uninstall" )
    {
        var action = "android.intent.action.DELETE";
        var uri = "package:" + curIcon.packageName;
        var cb = OnResult;
        app.SendIntent( null, null, action, null, uri, null, null, "result", cb ) 
    }
}

//Handle intent result.
function OnResult( resultCode )
{
    console.log( resultCode )
    
    //Check if app is still installed and remove icon if gone.
    var isInstalled = app.IsAppInstalled( curIcon.packageName )
    if( !isInstalled ) curIcon.layIcon.SetVisibility( "Gone" )
}