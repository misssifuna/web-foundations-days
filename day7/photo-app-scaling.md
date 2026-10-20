# Day 7 Assignment: Scaling SnapShare

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view feeds containing photos from people they follow.

The following assumptions are used:

- The app has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each photo generates one thumbnail of 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- Storage calculations use decimal units: 1 MB = 1,000 KB and 1 TB = 1,000 GB.
- Peak feed traffic is estimated at five times the average feed traffic.
- The estimates assume every daily active user uploads one photo and views 50 feed pages each day.

## 2. Traffic and Storage Estimates

### Daily active users

Daily active users (DAU) are 10% of registered users:

10,000,000 × 0.10 = **1,000,000 daily active users**

### Uploads per second

Each daily active user uploads one photo:

1,000,000 × 1 = 1,000,000 uploads per day

Average uploads per second:

1,000,000 ÷ 86,400 = **approximately 11.6 uploads per second**

### Feed views per second

Each daily active user views 50 feed pages:

1,000,000 × 50 = 50,000,000 feed views per day

Average feed views per second:

50,000,000 ÷ 86,400 = **approximately 579 feed views per second**

Peak feed views per second, using a factor of five:

579 × 5 = **approximately 2,894 feed views per second**

These are average and estimated peak request rates, not guaranteed maximum capacities. Real traffic may be uneven throughout the day.

### Annual photo storage

Original photos uploaded per day:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB per day

Annual original photo storage:

2 TB × 365 = **730 TB per year**

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB per day

Annual thumbnail storage:

50 GB × 365 = **18.25 TB per year**

Total annual storage for original photos and thumbnails:

730 TB + 18.25 TB = **748.25 TB per year**

This estimate excludes backups, additional copies, database records, and temporary files.

## 3. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is **read-heavy** because users view 50 feed pages per day but upload only one photo per day. The estimated daily total is 50 million feed views compared with 1 million uploads, meaning feed views occur 50 times as often as uploads.

The architecture should therefore prioritize fast feed delivery. A CDN can serve cached images and thumbnails, Redis can cache frequently requested feed data, and a database read replica can handle read queries without sending every read to the primary database. The primary database remains responsible for writes and authoritative data.

## 4. Where Should Photos Be Stored?

Photos should be stored in object storage rather than directly inside the relational database.

Object storage is designed for large files, provides scalable capacity, and can serve files independently of application servers. The database should store metadata such as the photo ID, owner ID, caption, upload time, and object-storage key or URL.

Separating photo files from database records keeps the database smaller and focused on structured data, relationships, and queries. The CDN can then cache and deliver the images and thumbnails close to users.

## 5. Architecture Diagram

```text
                         +----------------------+
                         |        Users         |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |          CDN         |
                         | Cached images and    |
                         | thumbnails           |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |    Load Balancer     |
                         +----------+-----------+
                                    |
                     +--------------+--------------+
                     |                             |
                     v                             v
             +---------------+             +---------------+
             |  App Server 1 |             |  App Server 2 |
             +-------+-------+             +-------+-------+
                     |                             |
                     +--------------+--------------+
                                    |
                  +-----------------+------------------+
                  |                 |                  |
                  v                 v                  v
          +---------------+  +-------------+  +----------------+
          | Redis Cache   |  | Primary DB  |  | Object Storage |
          | Feed data and |  | Users,      |  | Original photos|
          | metadata      |  | follows,    |  | and thumbnails |
          +---------------+  | photo data  |  +-------+--------+
                             +------+------+\         ^
                                    |        \        |
                                    v         \       |
                             +-------------+   \      |
                             | Read Replica|    \     |
                             | Feed reads  |     \    |
                             +-------------+      \   |
                                                   \  |
          Upload request / job dispatch             \ |
             App Server ----------------> +-----------+------+
                                          |   Job Queue      |
                                          +---------+--------+
                                                    |
                                                    v
                                          +------------------+
                                          | Thumbnail Worker |
                                          | Resize and       |
                                          | process photos   |
                                          +--------+---------+
                                                   |
                                                   v
                                          +------------------+
                                          | Object Storage   |
                                          | Save thumbnail   |
                                          +------------------+
```

The CDN handles cacheable static image delivery. Dynamic API requests and cache misses go through the load balancer to the application servers. The application servers use Redis and the database for application data, while uploads trigger asynchronous thumbnail processing through the queue and worker.

## 6. What Each Component Solves

- **CDN:** Serves cached images and thumbnails from locations close to users, reducing latency and load on the application and object-storage systems.
- **Load balancer:** Distributes incoming application requests across available app servers to prevent one server from becoming overloaded.
- **Application servers:** Handle business logic, authenticate users, process uploads, and assemble feed responses.
- **Redis cache:** Keeps frequently accessed feed data and other reusable results in memory to reduce repeated database queries.
- **Primary database:** Stores structured information such as users, follow relationships, photo metadata, and other authoritative application records.
- **Database read replica:** Handles eligible read queries to reduce the primary database's read workload and improve read scalability.
- **Object storage:** Stores original image files and generated thumbnails without filling the relational database with large binary files.
- **Job queue:** Holds thumbnail-processing jobs so image processing can happen asynchronously and jobs can wait for available workers.
- **Thumbnail worker:** Consumes queued jobs, creates smaller versions of uploaded photos, and saves the resulting thumbnails to object storage.

## 7. Photo Upload Flow

1. A user selects a photo and submits it through the application.
2. The application server authenticates the user and validates the file type, size, and upload permissions.
3. The original photo is uploaded to object storage, which returns or allows the application to identify its storage key.
4. The application saves the photo metadata and storage key in the primary database.
5. The application adds a thumbnail-generation job to the queue.
6. The application responds to the user once the original photo and required metadata have been safely stored and the job has been accepted, without waiting for thumbnail processing to finish.
7. A thumbnail worker retrieves the job, reads the original photo from object storage, and generates a 50 KB thumbnail target or suitable compressed version.
8. The worker saves the thumbnail to object storage and updates any relevant thumbnail metadata or processing status.
9. When users view feeds, the application retrieves feed data from Redis or the appropriate database, and the CDN delivers cached images and thumbnails. If a thumbnail is not ready yet, the app can display a placeholder until processing completes.

The upload flow should be designed to handle failures, including retries for thumbnail jobs and cleanup of incomplete uploads or metadata records.

## 8. Trade-Offs

### Trade-off 1: Cache speed versus data freshness

Redis makes feed reads faster and reduces database load, but cached data can become stale when users upload photos or change who they follow. The application must invalidate or update affected cache entries, adding complexity in exchange for better performance.

### Trade-off 2: Asynchronous thumbnails versus immediate availability

A queue allows uploads to complete without making users wait for thumbnail generation. However, thumbnails may not be available immediately, and the system must handle failed jobs, retries, and temporary processing delays.

### Trade-off 3: Read replicas versus consistency

A read replica can improve read capacity, but changes from the primary database may take time to appear on the replica. Some requests may need to read from the primary database when the freshest data is required.

### Trade-off 4: Object storage and CDN versus simplicity

Object storage and a CDN scale well for large image collections and frequent image delivery, but they introduce additional services, configuration, access-control requirements, and operational costs.

## Conclusion

SnapShare should use a read-optimized architecture with a CDN, Redis caching, load-balanced application servers, and a database read replica. Original photos and thumbnails belong in object storage, while a queue and thumbnail worker move image processing out of the immediate upload request. These choices support an estimated 579 average feed views per second, approximately 2,894 peak feed views per second, and about 748.25 TB of new photo and thumbnail storage per year.
