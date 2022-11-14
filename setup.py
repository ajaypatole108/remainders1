from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in remainders/__init__.py
from remainders import __version__ as version

setup(
	name="remainders",
	version=version,
	description="This app send the email to customer about outstanding remainning with them",
	author="ajay patole",
	author_email="ajaypatole@dhuparbrothers.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
