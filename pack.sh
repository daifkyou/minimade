#!/bin/bash

# you need zip

scons --aspect-ratio=16-9 --units --build-directory=build/16-9
scons --aspect-ratio=4-3 --units --build-directory=build/4-3
scons --aspect-ratio=any --units --build-directory=build/any

zip -9 -r - build/16-9 >pack/minimade-16-9.osk
zip -9 -r - build/4-3 >pack/minimade-4-3.osk
zip -9 -r - build/any >pack/minimade-any.osk
