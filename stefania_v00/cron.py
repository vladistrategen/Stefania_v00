from datetime import datetime


def execute_every_minute():
    # write the current time to the time.txt file in the dir
    f=open("/home/vladi/Desktop/time.txt", "w")
    f.write(str(datetime.now()))
    f.close()
    print('cron job executed')
    return 'cron job executed'



