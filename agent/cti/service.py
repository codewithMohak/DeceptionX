from agent.cti.mapper import map_alert_to_technique
from agent.cti.models import CTIEvent
from agent.cti.store import CTIStore

store = CTIStore()


def  enrich_event(event: CTIEvent)-> dict:
    technique= map_alert_to_technique(event.signature_id)

    enriched_event={
        "session_id": event.session_id,
        "timestamp": event.timestamp,
        "src_ip": event.src_ip,
        "signature_id": event.signature_id,
        "signature": event.signature,
        "evidence": event.evidence,
        "technique":(
            {
                "technique_id": technique.technique_id,
                "technique_name": technique.technique_name,
                "tactic": technique.tactic,
            }
             if technique
            else None
        ),
    }
    store.add(enriched_event)
    return enriched_event