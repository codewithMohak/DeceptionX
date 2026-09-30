from agent.cti.watcher import watch_suricata, watch_cowrie, watch_http


def test_multi_source_watchers_exist():
    assert callable(watch_suricata)
    assert callable(watch_cowrie)
    assert callable(watch_http)