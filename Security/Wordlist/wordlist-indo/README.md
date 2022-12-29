# Indonesian Password List Database


## DISCLAIMER
Usage of this wordlist for attacking targets without prior mutual
 consent is illegal. It is the end user's responsibility to obey all applicable 
local, state and federal laws. Developers assume no liability and are not respon
sible for any misuse or damage caused by this wordlist. This wordlist was created 
for education and supporting your Red Teamimg / Pentesting work according to applicable procedures and laws.

## Trick For Generating Password
### Check Name ur target / tag line
```text

In this case, we can generate wordlist by name of target / tag line of target 
example : 

Name : Rumah Babi
Tag Line : Babi Goreng Enak

We can add this word into wordlist :

- Babi/Rumah/Goreng/Enak
- babi/rumah/goreng/enak


```

### Check when target created
```text

In this case, we can combine information of target 
like date, address, owner name

example:

we will use whois for getting information about domain 
$ whois example.com

Domain Name: EXAMPLE.COM
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.iana.org
Registrar URL: http://res-dom.iana.org
Updated Date: 2022-08-14T07:01:31Z
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2023-08-13T04:00:00Z
Registrar: RESERVED-Internet Assigned Numbers Authority
Registrar IANA ID: 376
Registrar Abuse Contact Email:
Registrar Abuse Contact Phone:



We can add this word into wordlist :

- 1995
- 08
- 14


and combine with preverious wordlist 
example:

- Babi1995
- Gorengenak08
- Babienak1995
- etc.
```

### Combine with character 

```text
we can combine preverious wordlist with character like !@ (common character) 
example:

- Babi1995!!!
- @Gorengenak08!!!
- !Babi@enak1995
```

### Combine with number 

```text
we can combine  preverious wordlist with number like 1234567890 
example:

- Babi1995!!!
- @Gorengenak08!!!
- !Babi@enak1995
```

## Thanks to
- 
