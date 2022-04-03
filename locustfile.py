from locust import HttpUser, TaskSet, task, between
import requests
import time
import random

# class UserBehavior(TaskSet):
#     tasks = {index: 2}
#
#     def on_start(self):
#         login(self)
#
#     def on_stop(self):
#         logout(self)

class WebsiteUser(HttpUser):
#    task_set = UserBehavior
#    min_wait = 5000
#    max_wait = 9000

    wait_time = between(1, 5)

    def on_start(self):
        self.client.post("/search/login", {"username":"nonpenguin", "password":"777"})

        self.client.headers.update({'Cookie': 'csrftoken=le5JRgOP8KOMjVZf9YxkePTIv92XWJ091XED8lUPmfjfVF7IHgqsijQ2Vrovpu86; sessionid=x7bumgzjn19qyqimndfv6ahqhe55689k'})

#        response = requests.post("http://localhost/search/login", {"username":"nonpenguin", "password":"777"})
#        print(response)
#    self.client.headers.update({'Authorization': response.headers.get('Date')})
#    self.client.cookies.set('Authorization', response.cookies.get('NID'))
#    self.client.headers.update({'Authorization': str(response.content.decode().find('google'))})

    @task(6)
    def index(self):
        self.client.get("/search/file/")

    @task(3)
    def view_items(self):
        with self.client.rename_request("/search/file/[id]"):
            list_id = [119,121,123,125,126,127,128,130,133,135,136,137,141,142,144,151]
            item_id = random.choice(list_id)
            self.client.get(f"/search/file/{item_id}/")

    @task
    def view_items(self):
        with self.client.rename_request("/search/file/[id]/transcribe/"):
            list_id = [119,121,123,125,126,127,128,130,133,135,136,137,141,142,144,151]
            item_id = random.choice(list_id)
            self.client.get(f"/search/file/{item_id}/transcribe/")

    @task
    def search(self):
        self.client.get("/search2/file/" + "мир/")

#    def on_stop(self):
#       self.client.post("/search/logout", {"username":"nonpenguin", "password":"777"})
#        logout(self)
