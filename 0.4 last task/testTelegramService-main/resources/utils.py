from functools import wraps
from typing import Union, Dict, Iterable, Type, Callable

from flask import current_app


def handle(
        on_success: Union[Dict[str, str], str, bytes],
        on_error: Union[Dict[str, str], str, bytes] = None,
        handled_exceptions: Iterable[Type[Exception]] = None
):
    handled_exceptions = handled_exceptions or tuple()

    def view_wrapper(view: Callable) -> Callable:
        @wraps(view)
        def wrapper(*args, **kwargs):
            try:
                result = current_app.ensure_sync(view)(*args, **kwargs) or dict()
                result.update(on_success)
                return result
            except handled_exceptions:
                return on_error
        return wrapper
    return view_wrapper
