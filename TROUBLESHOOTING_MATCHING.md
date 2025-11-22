# Troubleshooting: Users Not Matching

## Common Issues and Solutions

### Issue 1: Users Don't See Each Other as Matches

**Problem:** Both users have accounts and profiles, but they don't appear in each other's match results.

**Solution Checklist:**

1. **✅ Both users must be SIGNED IN**
   - Check Profile page - should show email and "✓ Synced to cloud"
   - If not signed in, profiles are only in localStorage (not searchable)

2. **✅ Both users must have SAVED their profiles to Firestore**
   - After signing in, go to Profile page
   - Fill out profile (name, bio, tags, categories)
   - Click "Save Profile" button
   - You should see profile data saved

3. **✅ Both users must have the SAME CATEGORY selected**
   - User 1: Select "Sports" category on Profile page
   - User 2: Select "Sports" category on Profile page
   - Both must click "Save Profile" after selecting

4. **✅ Both users must search for the SAME TOPIC**
   - User 1: Go to Discover page → Select "Sports" topic → Generate matches
   - User 2: Go to Discover page → Select "Sports" topic → Generate matches
   - The topic on Discover page must match the category in their profiles

5. **✅ Both users should have similar tags**
   - User 1: Add "introverted" and "soccer" tags
   - User 2: Add "introverted" and "soccer" tags
   - Save profiles after adding tags

### How to Verify Profiles Are in Firestore

1. Go to Firebase Console → Firestore Database → Data tab
2. You should see a `users` collection
3. Click on it - you should see documents with user IDs
4. Click on a user document - check:
   - `categories` array should contain the category (e.g., `["Sports"]`)
   - `aboutTags` array should contain tags (e.g., `["introverted"]`)
   - `lookingTags` array should contain tags (e.g., `["soccer"]`)

### Debugging Steps

1. **Open Browser Console (F12)**
   - Go to Discover page
   - Select a topic (e.g., "Sports")
   - Click "Generate matches"
   - Look for console messages:
     - `🔍 Searching for real users with topic: Sports`
     - `📋 Current user profile categories: [...]`
     - `👥 Found X users with category "Sports"`
     - `👤 Checking user: ...`
     - `📊 Compatibility score: ...`
     - `✅ Adding match for user: ...`

2. **Check What's Being Queried**
   - The query looks for: `categories` array contains the topic
   - Example: If searching "Sports", user must have `categories: ["Sports"]` in Firestore

3. **Verify Both Users Have Data**
   - User 1: Check Firestore → users collection → their user ID
   - User 2: Check Firestore → users collection → their user ID
   - Both should have:
     - `categories: ["Sports"]` (or whatever topic you're searching)
     - `aboutTags: ["introverted"]` (or your tags)
     - `lookingTags: ["soccer"]` (or your tags)

### Step-by-Step Test Process

1. **User 1 Setup:**
   ```
   - Sign in as User 1
   - Go to Profile page
   - Fill out: Name, Bio, Photo URL
   - Select "Sports" category (check the box)
   - Add "introverted" to About-Me tags
   - Add "soccer" to Looking-For tags
   - Click "Save Profile"
   - Verify: Should see "✓ Synced to cloud"
   ```

2. **User 2 Setup:**
   ```
   - Sign in as User 2 (different browser/incognito)
   - Go to Profile page
   - Fill out: Name, Bio, Photo URL
   - Select "Sports" category (check the box)
   - Add "introverted" to About-Me tags
   - Add "soccer" to Looking-For tags
   - Click "Save Profile"
   - Verify: Should see "✓ Synced to cloud"
   ```

3. **Generate Matches:**
   ```
   - User 1: Go to Discover page
   - Select "Sports" from topic dropdown
   - Fill out preferences form
   - Click "Generate matches"
   - Should see User 2 in results
   
   - User 2: Go to Discover page
   - Select "Sports" from topic dropdown
   - Fill out preferences form
   - Click "Generate matches"
   - Should see User 1 in results
   ```

### Common Mistakes

❌ **Mistake 1:** Users sign up but don't save profiles
- **Fix:** Must click "Save Profile" after filling out form

❌ **Mistake 2:** Users select different categories
- **Fix:** Both must select the SAME category (e.g., both "Sports")

❌ **Mistake 3:** Users search different topics on Discover page
- **Fix:** Both must select the SAME topic on Discover page

❌ **Mistake 4:** Users not signed in
- **Fix:** Must be signed in for profiles to be in Firestore

❌ **Mistake 5:** Tags don't match
- **Fix:** Both users should have at least one overlapping tag for better matching

### Still Not Working?

1. Check browser console for errors
2. Check Firestore Console → Data tab → users collection
3. Verify both user documents have:
   - `categories` array with the topic
   - `aboutTags` and `lookingTags` arrays with tags
4. Check console logs when generating matches
5. Make sure both users are signed in (not just localStorage)

