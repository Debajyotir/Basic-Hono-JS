# FavYoutubeVideos

## Setup Instructions
```
bun install
```
## Run Instructions
```
bun run dev
```
## How to Use the API, with Examples

### 1. View All Favourite YouTube Videos
- HTTP Method: `GET`
- Route:
 ``` 
 http://localhost:3000/ 
 ```


### 2. Add a New Favourite YouTube Video
- HTTP Method: `POST`
- Body:
```
{
  "title": "string",
  "description": "string",
  "thumbnailUrl": "string (optional)",
  "watched": "boolean",
  "youtuberName": "string"
}
```
- Route: 
 ``` 
 http://localhost:3000/ 
```


### 3. View a Specific Favourite YouTube Video
- HTTP Method: `GET`
- Route:
 ``` 
 http://localhost:3000/:documentId 
 ```

### 4. Stream Description of a Specific Favourite YouTube Video
- HTTP Method: `GET`
- Route:
 ``` 
 http://localhost:3000/d/:documentId
 ```

### 5. Update a Specific Favourite YouTube Video
- HTTP Method: `PATCH`
- Route:
 ``` 
 http://localhost:3000/:documentId
 ```
### 6. Delete a Specific Favourite YouTube Video
- HTTP Method: `DELETE`
- Route:
 ``` 
 http://localhost:3000/delete/:documentId
 ```
### 7. Delete the Entire List
- HTTP Method: `DELETE`
- Route:
 ``` 
 http://localhost:3000/delete
 ```
