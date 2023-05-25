import asyncio
import json
from typing import List, Tuple, Callable

import pandas as pd
import requests


def load_dataframe(
        filename: str = None,
        url: str = None
):
    if url:
        html = requests.get(url).text
    elif filename:
        with open(filename, 'r') as file:
            html = file.read()

    table = pd.read_html(html)
    return table[0]


def serialize_list(
        dataframe: pd.DataFrame,
        serialize_function: Callable[[pd.Series], str]
) -> List[str]:
    proxy_list = []
    for _, row in dataframe.iterrows():
        proxy_list.append(serialize_function(row))
    return proxy_list


class Proxies:

    def __init__(self):
        self.work_proxies = []
        self.bad_proxies = []

    @property
    def bad_count(self) -> int:
        return len(self.bad_proxies)

    @property
    def work_count(self) -> int:
        return len(self.work_proxies)

    def add(self, proxy: str, is_proxy_valid: bool) -> None:
        print(f"""
            Proxy - {proxy}
            Is this proxy working - {is_proxy_valid}
        """)

        if is_proxy_valid:
            self.work_proxies.append(proxy)
        else:
            self.bad_proxies.append(proxy)

    async def add_list(self, proxy_list: List[str]) -> None:
        async for proxy, is_proxy_valid in test_proxy_list(proxy_list):
            self.add(proxy, is_proxy_valid)


def sync_text_proxy(proxy: str) -> Tuple[str, bool]:
    try:
        print(f"""
                    Ran test for proxy - {proxy}
                """)
        return proxy, requests.get('https://google.com', proxies={
            'http': proxy,
            'https': proxy
        }, timeout=(5, 5)).ok
    except (
            requests.exceptions.ConnectionError,
            requests.exceptions.ProxyError,
            requests.exceptions.SSLError,
            requests.exceptions.ConnectTimeout
    ):
        return proxy, False


async def test_proxy(proxy: str) -> Tuple[str, bool]:
    return await asyncio.get_event_loop()\
        .run_in_executor(None, lambda: sync_text_proxy(proxy))


async def test_proxy_list(proxy_list: List[str]) -> List[Tuple[str, bool]]:
    tasks = [
        asyncio.create_task(test_proxy(proxy))
        for proxy in proxy_list
    ]

    for task in asyncio.as_completed(tasks):
        yield await task


async def parse(save_file: str):

    data_frame = load_dataframe(url='https://free-proxy-list.net/')
    data_frame2 = load_dataframe(url='https://proxyhub.me/en/us-free-proxy-list.html')
    # data_frame3 = load_dataframe(url='https://freeproxy.world/')

    without_https = data_frame[["IP Address", 'Port']][data_frame['Https'] == 'no']
    second_frame = data_frame2[['IP', 'Port', 'Type']]
    # third_frame = data_frame3[['IP adress', 'Port', 'Type']]

    proxy_list = serialize_list(
        dataframe=without_https,
        serialize_function=lambda row: f"http://{row['IP Address']}:{row['Port']}"
    )
    proxy_list2 = serialize_list(
        dataframe=second_frame,
        serialize_function=lambda row: f"{str(row['Type']).lower()}://{row['IP']}:{row['Port']}"
    )
    # proxy_list3 = []
    #
    # for hash_, row in third_frame.iterrows():
    #     if hash_ % 2 != 0:
    #         proxy_list.append(f"{str(row['Type']).lower()}://{row['IP adress']}:{row['Port']}")

    proxies = Proxies()

    await asyncio.gather(*[
        proxies.add_list(proxy_list),
        proxies.add_list(proxy_list2),
    ])

    with open(save_file, 'w') as file:
        file.write(json.dumps({
            'proxies': proxies.work_proxies
        }, indent=4))
