# 🧪 Real-Time Collaboration Test Guide

## Quick Test Steps

### Test 1: Basic Real-Time Sync

1. **Open First Tab**
   ```
   http://localhost:3000
   Enter name: "User A"
   ```

2. **Open Second Tab**
   ```
   http://localhost:3000
   Enter name: "User B"
   ```

3. **Test Typing**
   ```
   Tab 1: Type "Hello"
   Tab 2: Should see "Hello" appear instantly
   
   Tab 2: Type " World"
   Tab 1: Should see "Hello World" instantly
   ```

### Test 2: Multiple Users

1. **Open 3+ Tabs**
   - Tab 1: User A
   - Tab 2: User B
   - Tab 3: User C

2. **Type in Any Tab**
   - All other tabs should update instantly
   - User count should show 3 users

3. **Check User List**
   - Click "👥 3" button
   - Should see all 3 users with colors

### Test 3: Cursor Tracking

1. **Open 2 Tabs**
2. **Type in Tab 1**
   - Tab 2 should show colored cursor
   - Cursor label shows "User A"
3. **Move cursor in Tab 1**
   - Tab 2 cursor should move

### Test 4: Connection Status

1. **Check Status Indicator**
   - Green dot = Connected
   - Red dot = Disconnected

2. **Test Reconnection**
   - Stop backend server
   - Status turns red
   - Start backend server
   - Status turns green
   - Content syncs automatically

## Expected Behavior

### ✅ Working Correctly

- **Instant Sync**: Changes appear in < 100ms
- **No Lag**: Smooth typing experience
- **Cursor Visible**: See other users' cursors
- **User Count**: Shows correct number
- **No Alerts**: No "out of sync" messages

### ❌ Issues to Check

- **Delayed Sync**: Changes take > 1 second
- **No Sync**: Changes don't appear
- **Cursor Missing**: Can't see other cursors
- **Alerts**: "Out of sync" messages
- **Connection**: Red status indicator

## Troubleshooting

### Issue: Changes Not Syncing

**Check:**
1. Backend running? `http://localhost:5000/health`
2. Frontend running? `http://localhost:3000`
3. Same room? Check room name in header
4. Browser console errors? Press F12

**Fix:**
```bash
# Restart backend
cd backend
npm start

# Restart frontend
cd frontend
npm start
```

### Issue: Slow Sync

**Check:**
1. Network tab in browser (F12)
2. WebSocket connection active?
3. Backend logs for errors

**Fix:**
```bash
# Check backend logs
# Should see:
✅ [default] User A joined (1 users)
✅ [default] User B joined (2 users)
```

### Issue: Cursor Not Visible

**Check:**
1. Multiple users in same room?
2. Users typing?
3. CSS loaded correctly?

**Fix:**
- Refresh both tabs
- Clear browser cache
- Check cursor-layer CSS

## Performance Test

### Test 5: Fast Typing

1. **Type Quickly**
   - Type as fast as possible
   - Should sync smoothly
   - No lag or delay

2. **Paste Large Text**
   - Copy 1000+ words
   - Paste in editor
   - Should sync to other tabs

3. **Multiple Users Typing**
   - All users type simultaneously
   - Should handle gracefully
   - No conflicts

## Debug Mode

### Enable Console Logging

**Frontend (App.js):**
```javascript
console.log('Sending changes:', newContent.substring(0, 50));
console.log('Received changes:', content.substring(0, 50));
```

**Backend (server.js):**
```javascript
console.log('Change received from:', socket.id);
console.log('Broadcasting to room:', roomId);
```

### Check WebSocket

1. **Open Browser DevTools (F12)**
2. **Network Tab**
3. **Filter: WS (WebSocket)**
4. **Click socket.io connection**
5. **View Messages tab**
6. **Should see:**
   ```
   send-changes: {content: "...", cursor: 5}
   receive-changes: {content: "...", version: 10}
   ```

## Success Criteria

✅ **Real-Time Sync Working:**
- Changes appear instantly (< 100ms)
- No alerts or errors
- Smooth typing experience
- Cursor tracking works
- User count accurate
- Connection stable

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No sync | Backend not running | Start backend |
| Slow sync | Network issues | Check connection |
| Alerts | Version conflicts | Fixed in latest code |
| No cursor | CSS not loaded | Refresh page |
| Wrong room | Different room names | Check room name |

## Test Checklist

- [ ] Open 2 tabs
- [ ] Enter different names
- [ ] Type in tab 1
- [ ] See changes in tab 2
- [ ] Type in tab 2
- [ ] See changes in tab 1
- [ ] Check user count (should be 2)
- [ ] Check cursors visible
- [ ] Check connection status (green)
- [ ] Test fast typing
- [ ] Test paste large text
- [ ] Close one tab
- [ ] User count updates (should be 1)

## Need Help?

**Still not working?**

1. Check backend logs
2. Check browser console
3. Check Network tab (WebSocket)
4. Restart both servers
5. Clear browser cache
6. Try incognito mode

**Report Issue:**
- Browser version
- Error messages
- Backend logs
- Steps to reproduce

---

**Real-time collaboration should work perfectly now!** ⚡
