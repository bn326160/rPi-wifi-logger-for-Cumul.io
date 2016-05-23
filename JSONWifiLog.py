#!/usr/bin/env python
import sys
import gobject
from time import gmtime, strftime
import os
import wicd
from wicd import dbusmanager
from dbus import DBusException
import json

# connection to DBUS interface
try:
    dbusmanager.connect_to_dbus()
except DBusException:
    print "Cannot connect to WICD daemon, please be sure daemon is started before using wconfig. You can start daemon with /etc/init.d/wicd start, or /etc/rc.d/wicd start, or wicd from root account."
    sys.exit()

dbus_ifaces = dbusmanager.get_dbus_ifaces()
daemon = dbus_ifaces['daemon']
wireless = dbus_ifaces['wireless']

def main():
    num_networks = wireless.GetNumberOfNetworks()
    if num_networks > 0:
        networks = []

        for x in range(0, num_networks):
            network = {'bssid':0,'name':0,'discovertime':0,'strength':0,'encryption':0,'mode':0,'channel':0}

            network['bssid'] = get_prop(x, 'bssid')
            network['name'] = get_prop(x, "essid")
            network['discovertime'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
            network['strength'] = fix_strength(get_prop(x, "quality"), -1)
            network['encryption'] = str(get_prop(x, "encryption_method"))
            network['mode'] = get_prop(x, 'mode')
            network['channel'] = get_prop(x, 'channel')

            networks.append(network)

        print(json.dumps(networks))

    else:
        print "No wireless networks found."

def get_prop(net_id, prop):
    """ Get attribute of wireless network """
    return wireless.GetWirelessProperty(net_id, prop)

def fix_strength(val, default):
    """ Assigns given strength to a default value if needed. """
    return val and int(val) or default

if __name__ == "__main__":
    main()
