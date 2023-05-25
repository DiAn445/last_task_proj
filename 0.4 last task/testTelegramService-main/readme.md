## Test Telegram Web Service

```
for login into client use

login : root
password: 1234
 
```

## API

All queries require "Authentication" header with JWT token inside

```
{
    "Authentication": "Bearer ${your_token}"
}
```

 - GET '/instance'
```
    Take info about instance.
    Nothing requires and returns
    
    {
        id: integer,
        phone: string,
        authoirzed: boolean,
        code_pending: boolean
    }
        
```

 - PUT '/instance'
```
    Update phone number for your instance.
    Requires "phone" to `url` params
    
    {
        ok: boolean,
        info: string
    }
```

 - POST '/instance/sign_in'

```
    Send code to your Telegram account.
    Nothing requires and returns
    
    {
        ok: boolean,
        info: string
    }
```

 - PATCH '/instance/sign_in'

```
    Requires 'code' (sent code from Telegram) to `url` params.
    Complete sign in for instance
    
    {
        ok: boolean,
        info: string
    }
```

 - GET '/instance/sign_in'

```
    Nothing requires and returns is instance authenticated
    
    {
        ok: boolean
    }
```

 - POST '/instance/log_out'
```
    Log out instance and returns
    
    {
        ok: boolean,
        info: string
    }
```

 - GET '/instance/info'
```
    Returns info about your instance
    
    {
        ok: boolean,
        info: string,
        **pyrogram.types.User
    }
```

 - PUT '/instance/info'
```
    Update instance information.
    Can take 'first_name', 'last_name' or 'bio' to `url` params
    
    {
        ok: boolean,
        info: string
    }
```


 - POST '/instance/search_user'
 

```
    Accept one of 'phone', 'user_id' or 'username' to `url` params.
    Returns user object fields
    
    {
        ok: boolean,
        info: string,
        **pyrogram.types.User
    }
    
```


 - GET '/contacts'
```
    List all instance contacts.
    If instance not authenticated - empty list
    
    [
        {
            **pyrogram.types.User
        }
    ]
```


 - POST '/contacts'
```
    Requires 'first_name', 'user_id' and cant accept 'last_name', 'phone' to `url` params
    
    {
        ok: boolean,
        info: string,
        **pyrogram.types.User
    }
    
```


 - GET '/chats'
```
    Returns available chats and nothing requires.
    
    [
        {
            **pyrogram.types.Chat
        }
    ]
```

 - POST '/chats'
```
    Creates new group minimum with 2 users.
    Requires 'chat_name' and 'user_id' to `url` params
    
    {
        ok: boolean,
        info: string,
        **pyrogram.types.Chat
    }
```

 - POST '/chats/members'
```
    Adds new member to group.
    Requires 'chat_id' and 'user_id' to `url` params
    
    {
        ok: boolean,
        info: string,
    }
```


 - DELETE '/chats/members'
```
    Deletes member from group.
    Requires 'chat_id' and 'user_id' to `url` params
    
    {
        ok: boolean,
        info: string,
    }
```

 - POST '/chats/messages'
```
    Write message to chat.
    Requires 'chat_id' and 'text' to `url` params
    
    {
        ok: boolean,
        info: string,
    }
```