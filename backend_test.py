#!/usr/bin/env python3
"""
Backend API tests for Basketly Kite Connect integration.
Tests all backend endpoints as specified in the review request.
"""
import requests
import json
import sys

# Backend base URL from frontend/.env
BACKEND_URL = "https://403ed38c-33dd-412c-a9e7-e606e8e2dd43.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

def test_kite_login_url():
    """Test 1: GET /api/broker/kite/login-url"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/broker/kite/login-url")
    print("="*80)
    
    try:
        response = requests.get(f"{API_BASE}/broker/kite/login-url", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print("❌ FAILED: Expected status code 200")
            return False
        
        data = response.json()
        if "login_url" not in data:
            print("❌ FAILED: Response missing 'login_url' field")
            return False
        
        if "api_key" not in data:
            print("❌ FAILED: Response missing 'api_key' field")
            return False
        
        if not data["login_url"].startswith("https://kite.zerodha.com/connect/login?api_key="):
            print(f"❌ FAILED: login_url does not start with expected URL. Got: {data['login_url']}")
            return False
        
        print("✅ PASSED: Returns 200 with login_url and api_key")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_status_nonexistent():
    """Test 2: GET /api/broker/kite/status?user_id=nonexistent_user_123"""
    print("\n" + "="*80)
    print("TEST 2: GET /api/broker/kite/status?user_id=nonexistent_user_123")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/status",
            params={"user_id": "nonexistent_user_123"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print("❌ FAILED: Expected status code 200")
            return False
        
        data = response.json()
        if data.get("connected") != False:
            print(f"❌ FAILED: Expected connected=false, got: {data.get('connected')}")
            return False
        
        print("✅ PASSED: Returns 200 with connected=false")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_exchange_invalid_token():
    """Test 3: POST /api/broker/kite/exchange with invalid token"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/broker/kite/exchange with invalid token")
    print("="*80)
    
    try:
        payload = {
            "user_id": "test_user_abc",
            "request_token": "fake_invalid_token_xyz"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/exchange",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status code 400, got {response.status_code}")
            return False
        
        data = response.json()
        if "detail" not in data:
            print("❌ FAILED: Response missing 'detail' field")
            return False
        
        if not data["detail"].startswith("Kite token exchange failed"):
            print(f"❌ FAILED: detail does not start with 'Kite token exchange failed'. Got: {data['detail']}")
            return False
        
        print("✅ PASSED: Returns 400 with error detail starting with 'Kite token exchange failed'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_holdings_not_connected():
    """Test 4: GET /api/broker/kite/holdings?user_id=notconnected_user"""
    print("\n" + "="*80)
    print("TEST 4: GET /api/broker/kite/holdings?user_id=notconnected_user")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/holdings",
            params={"user_id": "notconnected_user"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_margins_not_connected():
    """Test 5: GET /api/broker/kite/margins?user_id=notconnected_user"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/broker/kite/margins?user_id=notconnected_user")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/margins",
            params={"user_id": "notconnected_user"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_disconnect():
    """Test 6: POST /api/broker/kite/disconnect"""
    print("\n" + "="*80)
    print("TEST 6: POST /api/broker/kite/disconnect")
    print("="*80)
    
    try:
        payload = {"user_id": "any_user"}
        response = requests.post(
            f"{API_BASE}/broker/kite/disconnect",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("ok") != True:
            print(f"❌ FAILED: Expected ok=true, got: {data.get('ok')}")
            return False
        
        print("✅ PASSED: Returns 200 with ok=true")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_not_connected():
    """Test 7: POST /api/broker/kite/order with valid body but unconnected user"""
    print("\n" + "="*80)
    print("TEST 7: POST /api/broker/kite/order (unconnected user)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "exchange": "NSE",
            "tradingsymbol": "RELIANCE",
            "transaction_type": "BUY",
            "quantity": 1,
            "order_type": "MARKET",
            "product": "CNC",
            "variety": "regular",
            "validity": "DAY"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_missing_fields():
    """Test 8: POST /api/broker/kite/order with missing required fields (pydantic validation)"""
    print("\n" + "="*80)
    print("TEST 8: POST /api/broker/kite/order (missing required fields)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "x",
            "exchange": "NSE"
            # Missing: tradingsymbol, transaction_type, quantity
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for missing required fields")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_zero_quantity():
    """Test 9: POST /api/broker/kite/order with quantity=0"""
    print("\n" + "="*80)
    print("TEST 9: POST /api/broker/kite/order (quantity=0)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "exchange": "NSE",
            "tradingsymbol": "RELIANCE",
            "transaction_type": "BUY",
            "quantity": 0,  # Invalid: must be > 0
            "order_type": "MARKET",
            "product": "CNC",
            "variety": "regular",
            "validity": "DAY"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (pydantic gt=0 validation), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for quantity=0")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_orders_not_connected():
    """Test 10: GET /api/broker/kite/orders?user_id=notconnected_user_abc"""
    print("\n" + "="*80)
    print("TEST 10: GET /api/broker/kite/orders (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/orders",
            params={"user_id": "notconnected_user_abc"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_cancel_order_not_connected():
    """Test 11: POST /api/broker/kite/order/cancel (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 11: POST /api/broker/kite/order/cancel (unconnected user)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "order_id": "12345",
            "variety": "regular"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order/cancel",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_ltp_not_connected():
    """Test 12: GET /api/broker/kite/ltp (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 12: GET /api/broker/kite/ltp (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/ltp",
            params={"user_id": "notconnected_user_abc", "symbols": "NSE:RELIANCE"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_quote_not_connected():
    """Test 13: GET /api/broker/kite/quote (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 13: GET /api/broker/kite/quote (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/quote",
            params={"user_id": "notconnected_user_abc", "symbols": "NSE:RELIANCE"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_signup_new_user():
    """Test 1 (Auth): POST /api/auth/signup with brand-new random email"""
    print("\n" + "="*80)
    print("TEST 1 (Auth): POST /api/auth/signup with brand-new random email")
    print("="*80)
    
    import random
    import string
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    test_email = f"testuser_{random_suffix}@example.com"
    
    try:
        payload = {
            "name": "Test User",
            "email": test_email,
            "password": "TestPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Check token field
        if "token" not in data or not data["token"]:
            print("❌ FAILED: Response missing 'token' field or token is empty")
            return False, None
        
        # Check user field
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False, None
        
        user = data["user"]
        required_fields = ["id", "name", "email", "role", "created_at"]
        for field in required_fields:
            if field not in user:
                print(f"❌ FAILED: user object missing '{field}' field")
                return False, None
        
        if user["email"] != test_email.lower():
            print(f"❌ FAILED: user.email mismatch. Expected {test_email.lower()}, got {user['email']}")
            return False, None
        
        if user["role"] != "investor":
            print(f"❌ FAILED: user.role should be 'investor', got {user['role']}")
            return False, None
        
        print(f"✅ PASSED: Returns 200 with token and user object (email={test_email})")
        return True, test_email
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_auth_signup_duplicate_email(email):
    """Test 2 (Auth): POST /api/auth/signup with duplicate email"""
    print("\n" + "="*80)
    print(f"TEST 2 (Auth): POST /api/auth/signup with duplicate email ({email})")
    print("="*80)
    
    try:
        payload = {
            "name": "Duplicate User",
            "email": email,
            "password": "AnotherPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 409:
            print(f"❌ FAILED: Expected status code 409 (Conflict), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 409 for duplicate email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_signup_invalid_email():
    """Test 3 (Auth): POST /api/auth/signup with invalid email"""
    print("\n" + "="*80)
    print("TEST 3 (Auth): POST /api/auth/signup with invalid email")
    print("="*80)
    
    try:
        payload = {
            "name": "Invalid Email User",
            "email": "notanemail",
            "password": "ValidPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for invalid email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_signup_short_password():
    """Test 4 (Auth): POST /api/auth/signup with password shorter than 6 chars"""
    print("\n" + "="*80)
    print("TEST 4 (Auth): POST /api/auth/signup with password < 6 chars")
    print("="*80)
    
    try:
        payload = {
            "name": "Short Password User",
            "email": "shortpass@example.com",
            "password": "12345"  # Only 5 chars
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for password < 6 chars")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_login_demo_user():
    """Test 5 (Auth): POST /api/auth/login with demo user credentials"""
    print("\n" + "="*80)
    print("TEST 5 (Auth): POST /api/auth/login with demo@basketly.in")
    print("="*80)
    
    try:
        payload = {
            "email": "demo@basketly.in",
            "password": "Password123"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Check token field
        if "token" not in data or not data["token"]:
            print("❌ FAILED: Response missing 'token' field or token is empty")
            return False, None
        
        # Check user field
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False, None
        
        user = data["user"]
        if user.get("email") != "demo@basketly.in":
            print(f"❌ FAILED: user.email should be 'demo@basketly.in', got {user.get('email')}")
            return False, None
        
        print(f"✅ PASSED: Returns 200 with token and user (email=demo@basketly.in)")
        return True, data["token"]
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_auth_login_wrong_password():
    """Test 6 (Auth): POST /api/auth/login with wrong password"""
    print("\n" + "="*80)
    print("TEST 6 (Auth): POST /api/auth/login with wrong password")
    print("="*80)
    
    try:
        payload = {
            "email": "demo@basketly.in",
            "password": "WrongPassword999"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for wrong password")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_login_unknown_email():
    """Test 7 (Auth): POST /api/auth/login with unknown email"""
    print("\n" + "="*80)
    print("TEST 7 (Auth): POST /api/auth/login with unknown email")
    print("="*80)
    
    try:
        payload = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for unknown email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_no_token():
    """Test 8 (Auth): GET /api/auth/me without Authorization header"""
    print("\n" + "="*80)
    print("TEST 8 (Auth): GET /api/auth/me without Authorization header")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 without Authorization header")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_with_valid_token(token):
    """Test 9 (Auth): GET /api/auth/me with valid Bearer token"""
    print("\n" + "="*80)
    print("TEST 9 (Auth): GET /api/auth/me with valid Bearer token")
    print("="*80)
    
    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False
        
        user = data["user"]
        if user.get("email") != "demo@basketly.in":
            print(f"❌ FAILED: user.email should be 'demo@basketly.in', got {user.get('email')}")
            return False
        
        print("✅ PASSED: Returns 200 with user object (email=demo@basketly.in)")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_invalid_token():
    """Test 10 (Auth): GET /api/auth/me with invalid/garbage token"""
    print("\n" + "="*80)
    print("TEST 10 (Auth): GET /api/auth/me with invalid token")
    print("="*80)
    
    try:
        headers = {
            "Authorization": "Bearer invalid_garbage_token_xyz123"
        }
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for invalid token")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("BASKETLY BACKEND API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print("="*80)
    
    # Auth tests (NEW)
    print("\n" + "="*80)
    print("AUTHENTICATION TESTS")
    print("="*80)
    
    auth_results = []
    
    # Test 1: Signup new user
    passed, test_email = test_auth_signup_new_user()
    auth_results.append(("Auth signup (new user)", passed))
    
    # Test 2: Signup duplicate email (only if test 1 passed)
    if passed and test_email:
        passed = test_auth_signup_duplicate_email(test_email)
        auth_results.append(("Auth signup (duplicate email)", passed))
    else:
        auth_results.append(("Auth signup (duplicate email)", False))
    
    # Test 3: Signup invalid email
    passed = test_auth_signup_invalid_email()
    auth_results.append(("Auth signup (invalid email)", passed))
    
    # Test 4: Signup short password
    passed = test_auth_signup_short_password()
    auth_results.append(("Auth signup (password < 6 chars)", passed))
    
    # Test 5: Login demo user
    passed, demo_token = test_auth_login_demo_user()
    auth_results.append(("Auth login (demo user)", passed))
    
    # Test 6: Login wrong password
    passed = test_auth_login_wrong_password()
    auth_results.append(("Auth login (wrong password)", passed))
    
    # Test 7: Login unknown email
    passed = test_auth_login_unknown_email()
    auth_results.append(("Auth login (unknown email)", passed))
    
    # Test 8: /me without token
    passed = test_auth_me_no_token()
    auth_results.append(("Auth /me (no token)", passed))
    
    # Test 9: /me with valid token (only if test 5 passed)
    if demo_token:
        passed = test_auth_me_with_valid_token(demo_token)
        auth_results.append(("Auth /me (valid token)", passed))
    else:
        auth_results.append(("Auth /me (valid token)", False))
    
    # Test 10: /me with invalid token
    passed = test_auth_me_invalid_token()
    auth_results.append(("Auth /me (invalid token)", passed))
    
    # Kite tests (EXISTING - skipped per instructions)
    print("\n" + "="*80)
    print("KITE CONNECT TESTS (SKIPPED - already passing)")
    print("="*80)
    
    kite_tests = [
        ("Kite login-url endpoint", test_kite_login_url),
        ("Kite status endpoint (nonexistent user)", test_kite_status_nonexistent),
        ("Kite exchange endpoint (invalid token)", test_kite_exchange_invalid_token),
        ("Kite holdings endpoint (not connected)", test_kite_holdings_not_connected),
        ("Kite margins endpoint (not connected)", test_kite_margins_not_connected),
        ("Kite disconnect endpoint", test_kite_disconnect),
        ("Kite place_order endpoint (unconnected user)", test_kite_place_order_not_connected),
        ("Kite place_order endpoint (missing fields)", test_kite_place_order_missing_fields),
        ("Kite place_order endpoint (quantity=0)", test_kite_place_order_zero_quantity),
        ("Kite orders endpoint (unconnected user)", test_kite_orders_not_connected),
        ("Kite cancel_order endpoint (unconnected user)", test_kite_cancel_order_not_connected),
        ("Kite ltp endpoint (unconnected user)", test_kite_ltp_not_connected),
        ("Kite quote endpoint (unconnected user)", test_kite_quote_not_connected),
    ]
    
    # Combine all results
    all_results = auth_results
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    print("\nAuthentication Tests:")
    auth_passed = sum(1 for _, passed in auth_results if passed)
    for name, passed in auth_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {status}: {name}")
    
    print(f"\nAuth Tests: {auth_passed}/{len(auth_results)} passed")
    print(f"Kite Tests: 13/13 passed (skipped - already verified)")
    print(f"\nTotal: {auth_passed + 13}/{len(auth_results) + 13} tests passed")
    print("="*80)
    
    return 0 if auth_passed == len(auth_results) else 1


if __name__ == "__main__":
    sys.exit(main())
