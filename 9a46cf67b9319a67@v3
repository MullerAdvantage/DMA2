from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import hmac
import hashlib
import logging

logger = logging.getLogger(__name__)
app = FastAPI()

WEBHOOK_SECRET = ""  # set via env var in production


# --- Models ---

class CustomerDetails(BaseModel):
    customer_phone: str
    customer_rep: str
    customer_name: str
    customer_id: int
    customer_email: str


class JobDetails(BaseModel):
    job_address: str
    customer_rep: str
    job_name: str
    customer_email: str
    customer_phone: str
    job_number: str
    customer_name: str
    customer_id: int


class Stage(BaseModel):
    name: str
    code: str


class TaskDetails(BaseModel):
    due_date: Optional[str] = None
    task_title: str
    job_number: Optional[str] = None
    customer_name: Optional[str] = None
    customer_id: Optional[int] = None
    job_id: Optional[int] = None
    completed_at: Optional[str] = None
    completed_by_user_id: Optional[int] = None


class WebhookEvent(BaseModel):
    action: str
    operation: str
    id: int
    details: dict
    stage_moved_from: Optional[Stage] = None
    stage_moved_to: Optional[Stage] = None


# --- Handlers ---

def on_customer_create(event: WebhookEvent):
    d = CustomerDetails(**event.details)
    logger.info("Customer created: %s (id=%s, email=%s)", d.customer_name, d.customer_id, d.customer_email)
    # TODO: sync to CRM, send welcome email, etc.


def on_customer_delete(event: WebhookEvent):
    d = CustomerDetails(**event.details)
    logger.info("Customer deleted: %s (id=%s)", d.customer_name, d.customer_id)
    # TODO: archive records, cancel subscriptions, etc.


def on_job_create(event: WebhookEvent):
    d = JobDetails(**event.details)
    logger.info("Job created: %s (%s) for %s", d.job_name, d.job_number, d.customer_name)
    # TODO: assign team, schedule inspection, etc.


def on_job_stage_change(event: WebhookEvent):
    d = JobDetails(**event.details)
    from_stage = event.stage_moved_from.name if event.stage_moved_from else "?"
    to_stage = event.stage_moved_to.name if event.stage_moved_to else "?"
    logger.info("Job %s stage: %s → %s", d.job_number, from_stage, to_stage)
    # TODO: trigger stage-specific automations


def on_job_lost(event: WebhookEvent):
    d = JobDetails(**event.details)
    logger.info("Job lost: %s (%s)", d.job_name, d.job_number)
    # TODO: log lost reason, notify rep, etc.


def on_job_delete(event: WebhookEvent):
    d = JobDetails(**event.details)
    logger.info("Job deleted: %s (%s)", d.job_name, d.job_number)


def on_task_created(event: WebhookEvent):
    d = TaskDetails(**event.details)
    logger.info("Task created: %s (due=%s, job=%s)", d.task_title, d.due_date, d.job_id)
    # TODO: notify assignee, add to calendar, etc.


def on_task_completed(event: WebhookEvent):
    d = TaskDetails(**event.details)
    logger.info("Task completed: %s at %s by user %s", d.task_title, d.completed_at, d.completed_by_user_id)


HANDLERS = {
    ("customers", "create"):   on_customer_create,
    ("customers", "delete"):   on_customer_delete,
    ("jobs",      "create"):   on_job_create,
    ("jobs",      "stage_change"): on_job_stage_change,
    ("jobs",      "lost"):     on_job_lost,
    ("jobs",      "delete"):   on_job_delete,
    ("tasks",     "created"):  on_task_created,
    ("tasks",     "completed"): on_task_completed,
}


# --- Endpoint ---

@app.post("/webhook")
async def webhook(request: Request, x_webhook_signature: Optional[str] = Header(None)):
    body = await request.body()

    if WEBHOOK_SECRET:
        expected = hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, x_webhook_signature or ""):
            raise HTTPException(status_code=401, detail="Invalid signature")

    event = WebhookEvent.model_validate_json(body)
    key = (event.action, event.operation)
    handler = HANDLERS.get(key)

    if not handler:
        raise HTTPException(status_code=422, detail=f"Unhandled event: {event.action}/{event.operation}")

    handler(event)
    return {"ok": True}
